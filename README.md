# nodejs-docker-jenkins

[![CI](https://github.com/yashasravi21/nodejs-docker-jenkins/actions/workflows/ci.yml/badge.svg)](https://github.com/yashasravi21/nodejs-docker-jenkins/actions/workflows/ci.yml)

A small Express product API, containerised with Docker, built and deployed by a Jenkins pipeline, and instrumented with Prometheus metrics.

The application itself is deliberately simple. The point of this repository is the delivery pipeline around it: image build, automated tests, container deploy, health verification and metrics exposure.

---

## What it does

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/products` | GET | Returns a JSON list of products |
| `/health` | GET | Liveness check — returns status and uptime |
| `/metrics` | GET | Prometheus scrape endpoint (request count, latency histogram, Node.js runtime metrics) |
| `/` | GET | Static front-end served from `public/` |

---

## Tech stack

- **Runtime:** Node.js 20, Express 5
- **Container:** Docker (Alpine base, non-root user, `HEALTHCHECK`)
- **CI/CD:** Jenkins declarative pipeline + GitHub Actions
- **Monitoring:** `prom-client` exposing Prometheus metrics
- **Testing:** Node.js built-in test runner (`node --test`)

---

## Architecture

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px'}}}%%
flowchart LR
    A(["🧑‍💻 Developer"]) ==> B(["📤 Push"]) ==> C(["🐙 GitHub"])
    C ==> F(["🔧 Jenkins"])
    F ==> T(["🧪 npm test"])
    T ==> D(["🏗️ Docker Build"])
    D ==> G(["📦 Docker Image"]) ==> H(["🚀 Docker Run"])
    H ==> M(["📊 /metrics → Prometheus"])

    classDef pink fill:#e75480,stroke:#7a1f3d,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef orange fill:#ff9f1c,stroke:#a65700,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef green fill:#43aa8b,stroke:#1b4d1e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef blue fill:#3a86ff,stroke:#173d5e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef red fill:#ef476f,stroke:#8c1d3f,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px
    classDef purple fill:#9d4edd,stroke:#4a1d6e,stroke-width:4px,color:#fff,font-weight:bold,font-size:18px

    class A pink
    class B orange
    class C purple
    class F green
    class T green
    class D red
    class G orange
    class H pink
    class M blue
```

---

## Run it locally

**With Docker (recommended):**

```bash
git clone https://github.com/yashasravi21/nodejs-docker-jenkins.git
cd nodejs-docker-jenkins

docker build -t nodejs-docker-jenkins:latest .
docker run -d --name nodejs-app -p 3000:3000 nodejs-docker-jenkins:latest

curl http://localhost:3000/health
curl http://localhost:3000/api/products
curl http://localhost:3000/metrics
```

**Without Docker:**

```bash
npm ci
npm test
npm start
```

Then open <http://localhost:3000>.

---

## CI/CD pipeline

**GitHub Actions** (`.github/workflows/ci.yml`) runs on every push to `main`:

1. Installs dependencies with `npm ci`
2. Runs the test suite
3. Builds the Docker image
4. Starts the container and verifies `/health` and `/metrics` respond

**Jenkins** (`Jenkinsfile`) runs the same flow on a self-hosted agent and additionally deploys:

| Stage | What happens |
| --- | --- |
| Checkout | Pulls the branch that triggered the build |
| Install & Test | `npm ci` then `npm test` — the build fails here if a test fails |
| Build Docker Image | Tags the image with the Jenkins build number and `latest` |
| Deploy Container | Stops and removes the old container, runs the new one with `--restart unless-stopped` |
| Smoke Test | Polls `/health` for up to 30 seconds; prints container logs and fails the build if it never responds |

Images are tagged with `${BUILD_NUMBER}` rather than only `latest`, so any previous build can be rolled back to.

<!-- Replace the line below with your own screenshot: put the image in docs/ and update the path. -->
<!-- ![Jenkins pipeline](docs/jenkins-pipeline.png) -->

---

## Monitoring

`/metrics` exposes Prometheus-format metrics collected by `prom-client`:

- `http_requests_total` — counter, labelled by method, route and status code
- `http_request_duration_seconds` — histogram of request latency
- Default Node.js metrics — heap usage, event loop lag, GC pauses, open handles

Example Prometheus scrape config:

```yaml
scrape_configs:
  - job_name: nodejs-docker-jenkins
    static_configs:
      - targets: ['localhost:3000']
```

<!-- ![Grafana dashboard](docs/grafana-dashboard.png) -->

---

## Project structure

```
.
├── .github/workflows/ci.yml   # GitHub Actions pipeline
├── Dockerfile                 # Container image definition
├── Jenkinsfile                # Jenkins build + deploy pipeline
├── public/                    # Static front-end
├── test/smoke.test.js         # API smoke tests
├── server.js                  # Express app + Prometheus instrumentation
└── package.json
```

---

## Notes on the container image

- Manifests are copied before source so the dependency layer stays cached between builds
- `npm ci --omit=dev` installs exactly the locked versions, production dependencies only
- The container runs as the non-root `node` user
- A `HEALTHCHECK` lets Docker report the container as healthy or unhealthy

---

## Author

**Yashas R** — Bengaluru, India
[LinkedIn](https://www.linkedin.com/in/yashas-r-66336a3b5/) · yashasravi2101@gmail.com
