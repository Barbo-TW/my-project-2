const express = require('express');
const router = express.Router();

// Initial in-memory store
let items = [
  {
    id: 1,
    name: 'Setup Node.js Server',
    description: 'Configure Express with JSON parsing, CORS, and modular routing.',
    status: 'completed',
    createdAt: '2026-11-10T18:00:00.000Z',
    updatedAt: '2026-11-10T18:00:00.000Z'
  },
  {
    id: 2,
    name: 'Design REST Endpoints',
    description: 'Implement GET, POST, PUT, PATCH, and DELETE endpoints for items.',
    status: 'in-progress',
    createdAt: '2026-11-10T18:10:00.000Z',
    updatedAt: '2026-11-10T18:10:00.000Z'
  },
  {
    id: 3,
    name: 'Connect Database',
    description: 'Replace the in-memory store with PostgreSQL or MongoDB when ready.',
    status: 'pending',
    createdAt: '2026-11-10T18:20:00.000Z',
    updatedAt: '2026-11-10T18:20:00.000Z'
  }
];

let nextId = 4;

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

/**
 * GET /api/items
 * List all items with optional filtering (?status=completed&search=node)
 */
router.get('/', (req, res) => {
  const { status, search } = req.query;
  let result = [...items];

  if (status) {
    result = result.filter((item) => item.status === status.toLowerCase());
  }

  if (search) {
    const query = search.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
    );
  }

  res.status(200).json({
    count: result.length,
    data: result
  });
});

/**
 * GET /api/items/:id
 * Retrieve a single item by ID
 */
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${req.params.id} not found`,
      statusCode: 404
    });
  }

  res.status(200).json({ data: item });
});

/**
 * POST /api/items
 * Create a new item
 */
router.post('/', (req, res) => {
  const { name, description = '', status = 'pending' } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Field "name" is required and must be a non-empty string',
      statusCode: 400
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Field "status" must be one of: ${VALID_STATUSES.join(', ')}`,
      statusCode: 400
    });
  }

  const now = new Date().toISOString();
  const newItem = {
    id: nextId++,
    name: name.trim(),
    description: String(description).trim(),
    status,
    createdAt: now,
    updatedAt: now
  };

  items.push(newItem);
  res.status(201).json({
    message: 'Item created successfully',
    data: newItem
  });
});

/**
 * PUT /api/items/:id
 * Replace an existing item
 */
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${req.params.id} not found`,
      statusCode: 404
    });
  }

  const { name, description = '', status = 'pending' } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Field "name" is required and must be a non-empty string',
      statusCode: 400
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Field "status" must be one of: ${VALID_STATUSES.join(', ')}`,
      statusCode: 400
    });
  }

  const updatedItem = {
    ...items[index],
    name: name.trim(),
    description: String(description).trim(),
    status,
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  res.status(200).json({
    message: 'Item updated successfully',
    data: updatedItem
  });
});

/**
 * PATCH /api/items/:id
 * Partially update an existing item
 */
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${req.params.id} not found`,
      statusCode: 404
    });
  }

  const { name, description, status } = req.body || {};

  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Field "name" must be a non-empty string',
      statusCode: 400
    });
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: `Field "status" must be one of: ${VALID_STATUSES.join(', ')}`,
      statusCode: 400
    });
  }

  const current = items[index];
  const updatedItem = {
    ...current,
    name: name !== undefined ? name.trim() : current.name,
    description: description !== undefined ? String(description).trim() : current.description,
    status: status !== undefined ? status : current.status,
    updatedAt: new Date().toISOString()
  };

  items[index] = updatedItem;
  res.status(200).json({
    message: 'Item updated successfully',
    data: updatedItem
  });
});

/**
 * DELETE /api/items/:id
 * Delete an item by ID
 */
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with id ${req.params.id} not found`,
      statusCode: 404
    });
  }

  const [deleted] = items.splice(index, 1);
  res.status(200).json({
    message: 'Item deleted successfully',
    data: deleted
  });
});

module.exports = router;
