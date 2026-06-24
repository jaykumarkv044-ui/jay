const db = require('./db');

const seedData = () => {
  db.serialize(() => {
    // 1. Seed mbs_items
    const mbsItems = [
      { item_number: '47916', procedure_name: 'knee arthroscopy', clinical_category: 'Joint Reconstructions' },
      { item_number: '49318', procedure_name: 'hip replacement', clinical_category: 'Joint Replacements' },
      { item_number: '41789', procedure_name: 'tonsillectomy', clinical_category: 'Tonsil, Adenoid and Grommet Procedures' },
      { item_number: '32075', procedure_name: 'colonoscopy', clinical_category: 'Gastrointestinal Endoscopy' },
      { item_number: '11600', procedure_name: 'echocardiogram', clinical_category: 'Heart and Vascular System' }
    ];

    const insertMbs = db.prepare(`INSERT INTO mbs_items (item_number, procedure_name, clinical_category) VALUES (?, ?, ?)`);
    mbsItems.forEach(item => {
      insertMbs.run(item.item_number, item.procedure_name, item.clinical_category);
    });
    insertMbs.finalize();

    // 2. Seed products for MVP Insurers (HCF, Bupa, Medibank, NIB, HBF)
    // Using JSON strings for the arrays
    const products = [
      // HCF
      {
        insurer_name: 'HCF',
        product_name: 'HCF Hospital Silver Plus',
        tier: 'Silver Plus',
        covered_categories: JSON.stringify(['Joint Reconstructions', 'Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy', 'Heart and Vascular System']),
        extras_services: JSON.stringify([])
      },
      {
        insurer_name: 'HCF',
        product_name: 'HCF Hospital Basic',
        tier: 'Basic',
        covered_categories: JSON.stringify(['Tonsil, Adenoid and Grommet Procedures']),
        extras_services: JSON.stringify([])
      },
      // Bupa
      {
        insurer_name: 'Bupa',
        product_name: 'Bupa Ultimate Health Cover',
        tier: 'Gold',
        covered_categories: JSON.stringify(['Joint Reconstructions', 'Joint Replacements', 'Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy', 'Heart and Vascular System']),
        extras_services: JSON.stringify([])
      },
      {
        insurer_name: 'Bupa',
        product_name: 'Bupa Bronze Plus',
        tier: 'Bronze Plus',
        covered_categories: JSON.stringify(['Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy']),
        extras_services: JSON.stringify([])
      },
      // Medibank
      {
        insurer_name: 'Medibank',
        product_name: 'Medibank Hospital Advanced',
        tier: 'Silver Plus',
        covered_categories: JSON.stringify(['Joint Reconstructions', 'Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy', 'Heart and Vascular System']),
        extras_services: JSON.stringify([])
      },
      // NIB
      {
        insurer_name: 'NIB',
        product_name: 'NIB Standard Plus',
        tier: 'Bronze Plus',
        covered_categories: JSON.stringify(['Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy']),
        extras_services: JSON.stringify([])
      },
      // HBF
      {
        insurer_name: 'HBF',
        product_name: 'HBF Hospital Gold',
        tier: 'Gold',
        covered_categories: JSON.stringify(['Joint Reconstructions', 'Joint Replacements', 'Tonsil, Adenoid and Grommet Procedures', 'Gastrointestinal Endoscopy', 'Heart and Vascular System']),
        extras_services: JSON.stringify([])
      }
    ];

    const insertProduct = db.prepare(`INSERT INTO products (insurer_name, product_name, tier, covered_categories, extras_services) VALUES (?, ?, ?, ?, ?)`);
    products.forEach(prod => {
      insertProduct.run(prod.insurer_name, prod.product_name, prod.tier, prod.covered_categories, prod.extras_services);
    });
    insertProduct.finalize();

    console.log('Database seeded successfully with dummy data!');
  });
};

seedData();
