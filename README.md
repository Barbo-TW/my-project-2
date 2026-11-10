# Node.js REST API

A modular REST API built with **Node.js** and **Express**, including CRUD routes, input validation, centralized error handling, automated tests, and an interactive API playground.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server (defaults to port 3000)
npm start

# Run in watch mode during development
npm run dev

# Run automated tests
npm test
```

## API Endpoints

| Method   | Endpoint          | Description                                         |
| -------- | ----------------- | --------------------------------------------------- |
| `GET`    | `/api`            | API metadata and available routes                   |
| `GET`    | `/api/health`     | Health check and server uptime                      |
| `GET`    | `/api/items`      | List all items (supports `?status=` and `?search=`) |
| `GET`    | `/api/items/:id`  | Get a single item by ID                             |
| `POST`   | `/api/items`      | Create a new item                                   |
| `PUT`    | `/api/items/:id`  | Replace an existing item                            |
| `PATCH`  | `/api/items/:id`  | Partially update an item                            |
| `DELETE` | `/api/items/:id`  | Delete an item                                      |

## Example Requests

```bash
# List all items
curl http://localhost:3000/api/items

# Create a new item
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Add authentication", "description": "Use JWT middleware", "status": "pending"}'
```
