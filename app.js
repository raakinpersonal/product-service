const express = require('express');
const dotenv = require('dotenv');
// Load config
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
let products = [
{ id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
{ id: 2, name: 'Coffee Maker', price: 49.99, category: 'Home' }
];
// Middleware to parse JSON bodies
app.use(express.json());
// API Key Middleware
const checkApiKey = (req, res, next) => {
const apiKey = req.headers['x-api-key'];
if (apiKey !== process.env.API_SECRET) {
return res.status(403).json({ message: 'Forbidden: Invalid API Key'
});
}
next();
};
// Apply protection ONLY to the POST route (GET is public)
app.post('/api/products', checkApiKey, (req, res) => {
// ... (The rest of your POST code remains the same)
});
// Health Check
app.get('/health', (req, res) => {
res.status(200).json({ status: 'UP', service:
process.env.SERVICE_NAME });
});
app.listen(port, () => {
console.log(`${process.env.SERVICE_NAME} running on
http://localhost:${port}`);
});
// GET all products
app.get('/api/products', (req, res) => {
res.json(products);
});
// GET a single product by ID
app.get('/api/products/:id', (req, res) => {
const productId = parseInt(req.params.id);
const product = products.find(p => p.id === productId);
if (!product) {
return res.status(404).json({ message: 'Product not found' });
}
res.json(product);
});
