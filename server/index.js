const express = require('express');
const cors = require('cors');
const db = require('./db');

const path = require('path');

const app = express();
// Use the port provided by the hosting service, or fallback to 3001
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the static frontend files if we are in production
app.use(express.static(path.join(__dirname, '../dist')));

// Get list of unique insurers
app.get('/api/insurers', (req, res) => {
  db.all(`SELECT DISTINCT insurer_name FROM products ORDER BY insurer_name`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const insurers = rows.map(row => row.insurer_name);
    res.json({ insurers });
  });
});

// Get products for a specific insurer
app.get('/api/products/:insurerName', (req, res) => {
  const { insurerName } = req.params;
  db.all(`SELECT product_name, tier FROM products WHERE insurer_name = ?`, [insurerName], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const products = rows.map(row => row.product_name);
    res.json({ products });
  });
});

// Check hospital coverage
app.get('/api/check-hospital', (req, res) => {
  const { insurer, product, mbs } = req.query;

  if (!insurer || !product || !mbs) {
    return res.status(400).json({ error: 'Missing required parameters: insurer, product, and mbs are required.' });
  }

  // 1. Find the MBS item to get the clinical category
  db.get(`SELECT * FROM mbs_items WHERE item_number = ? OR procedure_name LIKE ?`, [mbs, `%${mbs}%`], (err, mbsRow) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!mbsRow) {
      return res.json({
        found: false,
        message: 'Could not find that MBS item or procedure in our database.'
      });
    }

    const clinicalCategory = mbsRow.clinical_category;

    // 2. Find the product and check if it covers the clinical category
    db.get(`SELECT covered_categories FROM products WHERE insurer_name = ? AND product_name = ?`, [insurer, product], (err, productRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!productRow) {
        return res.json({
          found: false,
          message: 'Could not find that product in our database.'
        });
      }

      let coveredCategories = [];
      try {
        coveredCategories = JSON.parse(productRow.covered_categories);
      } catch (e) {
        console.error("Error parsing categories", e);
      }

      const isCovered = coveredCategories.includes(clinicalCategory);

      // Plain English explanations dictionary (mocked for MVP)
      const explanations = {
        'Joint Reconstructions': 'Surgery to repair joints like knees and shoulders.',
        'Joint Replacements': 'Surgery to replace joints with artificial parts, like a hip replacement.',
        'Tonsil, Adenoid and Grommet Procedures': 'Surgery to remove tonsils or adenoids, or insert ear grommets.',
        'Gastrointestinal Endoscopy': 'A procedure using a tube to look inside your stomach or bowel, like a colonoscopy.',
        'Heart and Vascular System': 'Procedures relating to the heart and blood vessels.'
      };

      const explanation = explanations[clinicalCategory] || 'A specific category of medical procedures defined by the government.';

      res.json({
        found: true,
        procedureName: mbsRow.procedure_name,
        mbsItem: mbsRow.item_number,
        clinicalCategory: clinicalCategory,
        isCovered: isCovered,
        explanation: explanation,
        waitingPeriod: "Waiting period for pre-existing conditions: 12 months. For new conditions: 2 months. Please confirm with your insurer.",
        disclaimer: "This is general information only. Always confirm coverage, waiting periods, and out-of-pocket costs directly with your health insurer before scheduling any procedure."
      });
    });
  });
});

// Fallback to serve the React app for any other route
// Express 5.x uses path-to-regexp v8 which drops support for wildcard (*).
// Catch-all route needs to be defined differently.
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
