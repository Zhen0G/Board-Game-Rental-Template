// Import required modules
const express = require('express');  // Import Express framework
const bodyParser = require('body-parser');  // Import request body parser
const pg = require('pg');  // Import PostgreSQL client

// Create Express application
const app = express();

// Use middleware
// Increase body-parser limit to 10MB to support large image uploads
app.use(bodyParser.json({limit: '10mb'}));  // Parse JSON request bodies, limit set to 10MB
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));  // Support URL-encoded form data, limit set to 10MB

// Create PostgreSQL client
const client = new pg.Client({
  host: 'product-db',  // PostgreSQL database hostname
  port: 5432,  // PostgreSQL database port
  user: 'postgres',  // PostgreSQL database username
  password: 'postgres',  // PostgreSQL database password
  database: 'postgres'  // PostgreSQL database name
});

// Connect to PostgreSQL database
client.connect();

// Create products table (if it doesn't exist)
client.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT
  )
`);

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    // Query all products from the database
    const result = await client.query('SELECT * FROM products');
    
    // Convert each product object to array format [id, name, price, description]
    const products = result.rows.map(row => [row.id, row.name, row.price, row.description]);
    
    // Return products array
    res.json(products);
  } catch (err) {
    // If error occurs, return 500 error
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a product
app.post('/products', async (req, res) => {
  // Get product data from request body
  const { name, price, description, image } = req.body;
  
  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  try {
    // Prepare product description, append image if provided
    let fullDescription = description || '';
    if (image) {
      // If image is not empty, append it to the end of description
      fullDescription = fullDescription + '\n' + image;
    }
    
    // Insert product data into database
    const result = await client.query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, fullDescription]
    );
    
    // Return newly created product
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // If error occurs, return 500 error
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a product
app.put('/products/:id', async (req, res) => {
  // Get product ID from URL parameter
  const id = req.params.id;
  
  // Get product data from request body
  const { name, price, description } = req.body;
  
  // Validate required fields
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  try {
    // Update product in database
    const result = await client.query(
      'UPDATE products SET name = $1, price = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, price, description, id]
    );
    
    // Check if product was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Return updated product
    res.json(result.rows[0]);
  } catch (err) {
    // If error occurs, return 500 error
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to delete a product
app.delete('/products/:id', async (req, res) => {
  // Get product ID from URL parameter
  const id = req.params.id;
  
  try {
    // Delete product from database
    const result = await client.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [id]
    );
    
    // Check if product was found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Return success message
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    // If error occurs, return 500 error
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set application port
const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Product service listening on port ${PORT}`);
}); 