const express = require('express');
const router = express.Router();

// Data Store
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Coffee Maker', price: 49.99, category: 'Home' }
];

// API Key Middleware for the POST route
const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_SECRET) {
    return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
  }
  next();
};

// GET all products
router.get('/', (req, res) => {
  res.json(products);
});

// GET a single product by ID
router.get('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// POST create product (Protected by API Key)
router.post('/', checkApiKey, (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price) {
    return res.status(400).json({ message: 'Name and Price are required.' });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    category: category || 'Uncategorized'
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update a product[cite: 10]
router.put('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);

  // 1. Check if resource exists[cite: 10]
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // 2. Destructure inputs[cite: 10]
  const { name, price, category } = req.body;

  // 3. Robust Validation: Ensure required fields are present and valid[cite: 10]
  if (!name || price === undefined || !category) {
    return res.status(400).json({ 
      message: 'Validation failed: name, price, and category are required.' 
    });
  }

  // 4. Data Type Validation[cite: 10]
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  // 5. Update fields[cite: 10]
  product.name = name;
  product.price = price;
  product.category = category;

  res.json(product);
});

// DELETE a product[cite: 10]
router.delete('/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1); // Remove from array[cite: 10]

  // 204 No Content (Success)[cite: 10]
  res.status(204).send();
});

module.exports = router;