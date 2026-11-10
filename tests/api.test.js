const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

describe('Node.js REST API', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const { port } = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('GET /api/health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.status, 'ok');
  });

  it('GET /api/items lists seeded items', async () => {
    const res = await fetch(`${baseUrl}/api/items`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.count, 3);
    assert.ok(Array.isArray(body.data));
  });

  it('POST /api/items creates a new item', async () => {
    const res = await fetch(`${baseUrl}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Item',
        description: 'Created from test suite',
        status: 'in-progress'
      })
    });
    const body = await res.json();
    assert.equal(res.status, 201);
    assert.equal(body.data.name, 'Test Item');
    assert.equal(body.data.status, 'in-progress');
  });

  it('PATCH /api/items/:id partially updates an item', async () => {
    const res = await fetch(`${baseUrl}/api/items/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in-progress' })
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.id, 1);
    assert.equal(body.data.status, 'in-progress');
  });

  it('DELETE /api/items/:id removes an item', async () => {
    const res = await fetch(`${baseUrl}/api/items/4`, {
      method: 'DELETE'
    });
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.data.id, 4);
  });

  it('Returns 404 JSON on unknown route', async () => {
    const res = await fetch(`${baseUrl}/api/unknown`);
    const body = await res.json();
    assert.equal(res.status, 404);
    assert.equal(body.error, 'Not Found');
  });
});
