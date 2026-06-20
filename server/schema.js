const db = require('./db');

const setupDatabase = () => {
  db.serialize(() => {
    // Drop existing tables just in case we are re-initializing
    db.run(`DROP TABLE IF EXISTS mbs_items`);
    db.run(`DROP TABLE IF EXISTS products`);

    // Create mbs_items table
    db.run(`
      CREATE TABLE mbs_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_number TEXT NOT NULL,
        procedure_name TEXT NOT NULL,
        clinical_category TEXT NOT NULL
      )
    `);

    // Create products table
    // covered_categories and extras_services will be stored as JSON strings
    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        insurer_name TEXT NOT NULL,
        product_name TEXT NOT NULL,
        tier TEXT NOT NULL,
        covered_categories TEXT NOT NULL,
        extras_services TEXT
      )
    `, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Tables created successfully!');
        }
    });
  });
};

setupDatabase();

module.exports = setupDatabase;