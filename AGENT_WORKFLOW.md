<p align="center">
  <img src="https://img.shields.io/badge/AI%20Agent%20Workflow%20Log-2025-purple?style=for-the-badge&logo=openai&logoColor=white" />
</p>

<h1 align="center">🤖 AI Agent Workflow Log</h1>

<p align="center">
A detailed log of how multiple AI coding assistants — <b>Gemini (Google)</b>, <b>ChatGPT (GPT-5)</b>, <b>Cursor Agent</b>, and <b>GitHub Copilot</b> — were used to design and build the <b>FuelEU Maritime Compliance Platform</b>.
</p>

---

## 🧭 Overview

Each AI agent played a different role during project development:

- 🧠 **Gemini** — Environment setup, PostgreSQL configuration, and initial bootstrapping.  
- ⚙️ **ChatGPT (GPT-5)** — Core backend logic, Prisma debugging, frontend integration, and bug analysis.  
- 🧩 **Cursor Agent** — Refactoring and TypeScript path alias corrections.  
- 🎨 **GitHub Copilot** — Inline completions and rapid JSX/Tailwind generation.

---

## 🧩 Agents Used

| 🧠 Agent | 🔧 Primary Use |
|----------|----------------|
| **Gemini** | Initial scaffolding, Prisma schema, DB setup |
| **ChatGPT (GPT-5)** | Core backend API design, compliance formulas, debugging |
| **Cursor Agent** | TypeScript refactoring, alias debugging |
| **Copilot** | Tailwind and boilerplate JSX generation |

---

## 🧱 Example 1 — Project Setup & Database Schema *(Gemini)*

**Prompt:**  
> “I’m working on a full-stack assignment using Node.js, TypeScript, and PostgreSQL with Hexagonal Architecture. Please guide me through initializing dependencies, configuring TypeScript, and defining Prisma schema based on the provided table.”

**AI Output Highlights**
- Generated complete `tsconfig.json` with path mappings (`@core`, `@adapters`, etc.).  
- Installed and configured Express, Prisma, and ts-node-dev.  
- Suggested PostgreSQL setup: `brew install postgresql@16`.  
- Created initial `schema.prisma` with Route model fields.

**Fixes Made**
- `psql: command not found` → `brew link postgresql@16`.  
- Prisma connection error → added `.env` with `DATABASE_URL`.  
- Permission issue →  
  ```sql
  ALTER USER fueleu_admin CREATEDB;
````

* Validation: `npx prisma migrate dev` successfully created `fueleu_db` and seeded 5 routes.
  ✅ *Gemini was great for scaffolding, weak for path alias handling.*

---

## ⚙️ Example 2 — Express Server Entrypoint *(Gemini → Cursor)*

**Prompt:**

> “Create the backend entrypoint (server.ts, index.ts) and include a dev script using ts-node-dev.”

**AI Output**

```ts
// server.ts
import express from "express";
export function createServer() {
  const app = express();
  app.use(express.json());
  app.get("/health", (_, res) => res.status(200).send({ status: "ok" }));
  return app;
}
```

```ts
// index.ts
import * as dotenv from "dotenv";
dotenv.config();
import { createServer } from "./infrastructure/server/server";
const port = process.env.PORT || 4000;
const app = createServer();
app.listen(port, () => console.log(`[Server] Running at ${port}`));
```

**Fix by Cursor Agent**
Added alias loader for dev script:

```json
"dev": "ts-node-dev -r tsconfig-paths/register --respawn --transpile-only src/index.ts"
```

✅ *Result:* Server reachable at [http://localhost:4000/health](http://localhost:4000/health)

---

## 📊 Example 3 — Database Seeding *(Gemini → ChatGPT)*

**Prompt:**

> “Seed the five route records from the KPIs dataset using Prisma.”

**AI Output**

```ts
await prisma.route.deleteMany();
await prisma.route.createMany({ data: routesData });
```

**Fix**
Gemini missed the seed script entry; ChatGPT corrected it:

```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

✅ *Validation:* `npx prisma db seed` worked.
*Gemini handled data creation, GPT-5 fixed execution context.*

---

## 🧮 Example 4 — Routes API *(GPT-5)*

**Prompt:**

> “Implement /routes and /routes/:routeId/baseline endpoints using Hexagonal Architecture.”

**Files Generated**

```
core/domain/Route.ts
core/ports/outbound/RouteRepository.ts
adapters/outbound/postgres/PrismaRouteRepository.ts
core/application/usecases/GetRoutes.ts
core/application/usecases/SetBaselineRoute.ts
adapters/inbound/http/RouteController.ts
```

**Key Feature:**
`setBaseline()` used `prisma.$transaction()` to unset/set baseline atomically.
✅ *GPT-5 followed clean architecture precisely.*

---

## ⚖️ Example 5 — Route Comparison Endpoint *(GPT-5)*

**Prompt:**

> “Implement /routes/comparison returning baseline, percentDiff, and compliant flag.”

```ts
const percentDiff = ((r.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100;
const compliant = r.ghgIntensity <= baseline.ghgIntensity;
```

**Fix:** renamed `differencePercent` → `percentDiff` to match frontend expectations.
✅ *Chart rendered correctly after fix.*

---

## 🌍 Example 6 — Compliance Balance (CB) *(GPT-5)*

**Prompt:**

> “Build /compliance/cb and /compliance/adjusted-cb using formula CB = (Baseline GHG − Route GHG) × Distance.”

```ts
const cbGco2eq = (baseline.ghgIntensity - route.ghgIntensity) * route.distance;
const adjustedCb = cbGco2eq * 0.95;
```

✅ *Handled missing baselines gracefully; validated via curl.*
GPT-5’s reasoning and edge-case handling were spot on.

---

## 💰 Example 7 — Banking API *(Article 20)*

**Prompt:**

> “Implement /banking/bank and /banking/apply validating surplus/deficit.”

**Highlights**

* Domain: `BankEntry.ts`, immutable ledger (credits/debits).
* Validation for insufficient balance and ledger consistency.

**Test Flow**

1. `/compliance/cb?routeId=R002&year=2024`
2. `POST /banking/bank`
3. `GET /banking/records` → shows surplus
4. `POST /banking/apply` → deficit reduced

✅ *Clean use-case separation and validation logic.*

---

## ⚓ Example 8 — Pooling API *(Article 21)*

**Prompt:**

> “Implement pooling with Σ(adjustedCB) ≥ 0 and prevent worsening deficits.”

**Features**

* `Pool` & `PoolMember` models
* Greedy surplus-to-deficit allocation
* Validation for invalid pools

✅ *Invalid pools blocked, valid pools accepted — UI showed red/green totals.*

---

## 🧠 Validation & Debugging Summary

| 🧩 Problem               | 🧠 Agent | 🛠️ Fix                            |
| ------------------------ | -------- | ---------------------------------- |
| Prisma unique constraint | GPT-5    | deleteMany before seed             |
| TS path alias error      | Cursor   | Added `-r tsconfig-paths/register` |
| PercentDiff not showing  | GPT-5    | Renamed key                        |
| CB negative handling     | Manual   | Added baseline check               |
| DB permissions           | Gemini   | `ALTER USER ... CREATEDB`          |

---

## 📈 Observations

| Area           | Impact of AI                                       |
| -------------- | -------------------------------------------------- |
| Setup          | ⚡ 10× faster project bootstrapping                 |
| Prisma schema  | 🧩 Saved hours of manual modeling                  |
| Business logic | 🧠 GPT-5 modeled EU formulas accurately            |
| Debugging      | 🧰 GPT-5 + Cursor resolved alias and Prisma errors |
| Documentation  | 🪶 Generated structured MD logs rapidly            |

---

## 🧩 Best Practices Followed

* Clean **Hexagonal Architecture (core/adapters/infrastructure)**
* **Atomic transactions** via Prisma
* **Validation-first** design before data mutations
* **TypeScript strict mode** enabled
* **Reusable domain logic** for CB / Banking / Pooling
* **Incremental commits** showcasing AI involvement

---

## 🚀 Summary

AI agents accelerated development dramatically while maintaining architectural discipline.
**Gemini** handled setup, **GPT-5** managed reasoning and logic, and **Cursor + Copilot** polished and optimized the code.

Manual validation ensured compliance accuracy and production readiness.
Together, they proved that **AI-assisted engineering can deliver clean, scalable software — faster than ever.**

---
