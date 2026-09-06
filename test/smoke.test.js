const test = require("node:test");
const assert = require("node:assert");
const app = require("../server");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => server.close());

test("GET /health returns UP", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.strictEqual(body.status, "UP");
});

test("GET /api/products returns a non-empty list", async () => {
  const res = await fetch(`${baseUrl}/api/products`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body));
  assert.ok(body.length > 0);
  assert.ok(body[0].name);
});

test("GET /metrics exposes Prometheus output", async () => {
  const res = await fetch(`${baseUrl}/metrics`);
  assert.strictEqual(res.status, 200);
  const text = await res.text();
  assert.match(text, /http_requests_total/);
});
