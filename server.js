const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Prometheus metrics
// ---------------------------------------------------------------------------
const register = new client.Registry();
register.setDefaultLabels({ app: "nodejs-docker-jenkins" });

// CPU, memory, event-loop lag, GC stats etc.
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests handled",
  labelNames: ["method", "route", "status_code"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 3, 5],
});

register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);

// Record every request that passes through the app.
app.use((req, res, next) => {
  const stopTimer = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    };
    httpRequestsTotal.inc(labels);
    stopTimer(labels);
  });
  next();
});

app.use(express.static("public"));

// ---------------------------------------------------------------------------
// Application routes
// ---------------------------------------------------------------------------
const products = [
  { id: 1, name: "Gaming Laptop", price: 89999, image: "https://picsum.photos/300?1" },
  { id: 2, name: "Mechanical Keyboard", price: 4999, image: "https://picsum.photos/300?2" },
  { id: 3, name: "Wireless Mouse", price: 1999, image: "https://picsum.photos/300?3" },
  { id: 4, name: "27 Inch Monitor", price: 14999, image: "https://picsum.photos/300?4" },
];

app.get("/api/products", (req, res) => {
  res.json(products);
});

// Liveness / readiness probe target.
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    uptime_seconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Prometheus scrape endpoint.
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// ---------------------------------------------------------------------------
// Start only when run directly, so tests can import the app.
// ---------------------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
