const crypto = require('crypto');

const requestLogger = (req, res, next) => {
  // Generate a unique ID for this request
  const requestId = crypto.randomUUID();

  // Attach it to the request object so other routes can see it[cite: 13]
  req.requestId = requestId;

  // Log the start of the request[cite: 13]
  console.log(`[${new Date().toISOString()}] [ID: ${requestId}] ${req.method} ${req.url}`);

  // Set a header so the client knows the ID too[cite: 13]
  res.setHeader('X-Request-Id', requestId);

  next();
};

module.exports = requestLogger;