const express = require('express');
const dotenv = require('dotenv');
const requestLogger = require('./middleware/logger'); // Observability middleware from Exercise 3[cite: 13, 14]
const productRoutes = require('./routes/products');

// Load config
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Essential Middleware
app.use(express.json());
app.use(requestLogger); // Automatically tracks requests with a unique Request ID[cite: 13, 14]

// Mount the product routes
// Any request starting with /api/products will be handled by productRoutes[cite: 8, 22]
app.use('/api/products', productRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'UP', 
    service: process.env.SERVICE_NAME 
  });
});

// Error Handling Middleware (Placed at the end after all routes)[cite: 14]
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`${process.env.SERVICE_NAME} running on http://localhost:${port}`);
});