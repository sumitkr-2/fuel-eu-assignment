
---

```markdown
# 🛳️ FuelEU Maritime Compliance Platform

A full-stack implementation of the **FuelEU Maritime Regulation (EU 2023/1805)** compliance platform.  
It models **Compliance Balances (CB)**, **Banking**, **Pooling**, and **Route Comparison** using a clean **Hexagonal Architecture**.

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript + TailwindCSS |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | PostgreSQL + Prisma ORM |
| **Architecture** | Hexagonal / Ports & Adapters |
| **Tools** | Docker (optional), ESLint, Prettier |
| **AI Agents** | Gemini, ChatGPT (GPT-5), Cursor, GitHub Copilot |

---

## 🧱 Architecture Overview

```

backend/
core/
domain/             # Entities (Route, BankEntry, Pool, etc.)
application/         # Use-cases (ComputeCB, BankSurplus, etc.)
ports/               # Interfaces (repositories)
adapters/
inbound/http/        # Controllers / Routers
outbound/postgres/   # Prisma repository adapters
infrastructure/
db/                  # Prisma schema & migrations
server/              # Express server setup

frontend/
src/
core/                # Domain logic & hooks
adapters/            # API clients / UI
shared/              # Components & utils

````

### 🧩 Principles Followed

- Dependency inversion (core → ports → adapters)  
- No framework dependencies inside `core/`  
- All formulas implemented in use-cases, not controllers  

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit DATABASE_URL if needed
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
````

Server runs at 👉 **[http://localhost:3001](http://localhost:4000)**

<img width="854" height="57" alt="image" src="https://github.com/user-attachments/assets/a8498aa1-79d1-4368-a86f-f67d1360e965" />


---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at 👉 **[http://localhost:5173](http://localhost:5173)**

<img width="1470" height="878" alt="image" src="https://github.com/user-attachments/assets/5e729073-4625-4bd7-a98e-49fa861220f3" />

<img width="1465" height="879" alt="image" src="https://github.com/user-attachments/assets/61614b64-855a-4df6-94eb-d38becd5172f" />

<img width="1447" height="456" alt="image" src="https://github.com/user-attachments/assets/d50328c3-6497-4f9b-88d7-acc3e721271f" />


---

### 3️⃣ Environment Variables

**backend/.env**

```bash
DATABASE_URL="postgresql://fueleu_admin:password@localhost:5432/fueleu_db?schema=public"
PORT=3001
```

**frontend/.env**

```bash
VITE_API_BASE_URL="http://localhost:3001"
```

---

## 🔗 API Endpoints

### `/routes`

| Method | Endpoint                    | Description                    |
| ------ | --------------------------- | ------------------------------ |
| `GET`  | `/routes`                   | Fetch all routes               |
| `POST` | `/routes/:routeId/baseline` | Set a baseline route           |
| `GET`  | `/routes/comparison`        | Compare all routes vs baseline |

### `/compliance`

| Method | Endpoint                               | Description                         |
| ------ | -------------------------------------- | ----------------------------------- |
| `GET`  | `/compliance/cb?routeId&year`          | Compute Compliance Balance          |
| `GET`  | `/compliance/adjusted-cb?routeId&year` | Compute Adjusted Compliance Balance |

### `/banking`

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| `GET`  | `/banking/records?routeId&year` | Fetch banked entries |
| `POST` | `/banking/bank`                 | Bank surplus         |
| `POST` | `/banking/apply`                | Apply banked surplus |

### `/pools`

| Method | Endpoint | Description              |
| ------ | -------- | ------------------------ |
| `POST` | `/pools` | Create a pool of ships   |
| `GET`  | `/pools` | Fetch all existing pools |

---

## 🧮 Core Formulae

| Concept                     | Formula                      |
| --------------------------- | ---------------------------- |
| **Target Intensity (2025)** | 89.3368 gCO₂e/MJ             |
| **Energy in Scope (MJ)**    | `fuelConsumption × 41,000`   |
| **Compliance Balance (CB)** | `(Target − Actual) × Energy` |
| **Adjusted CB**             | `CB × 0.95`                  |
| **Pooling Rule**            | `Σ(adjustedCB) ≥ 0`          |

---

## 📊 Example Requests

### 🧾 Compute CB

```bash
curl "http://localhost:3001/compliance/cb?routeId=R002&year=2024"
```

### 💰 Bank Surplus

```bash
curl -X POST http://localhost:3001/banking/bank \
     -H "Content-Type: application/json" \
     -d '{"routeId":"R002","year":2024}'
```

### ⚓ Pooling

```bash
curl -X POST http://localhost:3001/pools \
     -H "Content-Type: application/json" \
     -d '{"members":[{"routeId":"R002"},{"routeId":"R004"}],"year":2025}'
```

---

## 🧩 Frontend Tabs Overview

| Tab         | Description                                             |
| ----------- | ------------------------------------------------------- |
| **Routes**  | Displays all routes, allows setting baseline            |
| **Compare** | Compares routes vs baseline (% difference & compliance) |
| **Banking** | Handles surplus banking and deficit application         |
| **Pooling** | Enables ship pooling under compliance rules             |

---

## 🤖 AI Agent Collaboration

This project was built using **AI-assisted development** — see
📘 [`AGENT_WORKFLOW.md`](./AGENT_WORKFLOW.md) for detailed prompts, fixes, and validation logs.

---

## 💬 Reflection

Read my short essay on lessons learned using multiple AI tools:
📗 [`REFLECTION.md`](./REFLECTION.md)

---

## 👨‍💻 Author

**Sumit Kumar**
Full-Stack Developer | AI-Driven Software Engineer

[🌐 LinkedIn Profile](https://www.linkedin.com/in/sumit-kumar2004/)
📧 [sumit.kumar120664@gmail.com](mailto:sumit.kumar120664@gmail.com)

---

## 🏁 Summary

AI agents like **Gemini**, **ChatGPT (GPT-5)**, **Cursor**, and **Copilot** helped design, refactor, and debug this entire project.
The result is a clean, maintainable, and fully functional FuelEU compliance platform — built fast, but engineered right.

---
