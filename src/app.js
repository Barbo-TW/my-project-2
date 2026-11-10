const path = require('path');
const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routes/items');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve interactive API documentation / playground on root
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Overview endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    name: 'Node.js REST API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: 'GET /api/health',
      listItems: 'GET /api/items?status=&search=',
      getItem: 'GET /api/items/:id',
      createItem: 'POST /api/items',
      replaceItem: 'PUT /api/items/:id',
      updateItem: 'PATCH /api/items/:id',
      deleteItem: 'DELETE /api/items/:id'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Resource routes
app.use('/api/items', itemsRouter);

// Fallback for root if static index.html is not hit
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// 404 and Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
