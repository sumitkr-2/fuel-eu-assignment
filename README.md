
<p align="center">
  <img src="https://img.shields.io/badge/FuelEU%20Maritime%20Compliance%20Platform-2025-blue?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<h1 align="center">🛳️ FuelEU Maritime Compliance Platform</h1>

<p align="center">
A full-stack implementation of the <b>FuelEU Maritime Regulation (EU 2023/1805)</b> compliance platform.<br/>
It models <b>Compliance Balances (CB)</b>, <b>Banking</b>, <b>Pooling</b>, and <b>Route Comparison</b> — built with a clean <b>Hexagonal Architecture</b>.
</p>

---

## ⚙️ Tech Stack

| 💻 Layer | 🧩 Technology |
|----------|---------------|
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
application/        # Use-cases (ComputeCB, BankSurplus, etc.)
ports/              # Interfaces (repositories)
adapters/
inbound/http/       # Controllers / Routers
outbound/postgres/  # Prisma repository adapters
infrastructure/
db/                 # Prisma schema & migrations
server/             # Express server setup

frontend/
src/
core/               # Domain logic & hooks
adapters/           # API clients / UI
shared/             # Components & utils

````

### 🧩 Principles

- Dependency inversion (**core → ports → adapters**)  
- Framework-free domain logic inside `core/`  
- Use-cases handle formulas, controllers only orchestrate  

---

## 🚀 Quick Start

### 1️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
````

Server: **[http://localhost:3001](http://localhost:3001)**

---

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App: **[http://localhost:5173](http://localhost:5173)**

<p align="center">
  <img src="https://github.com/user-attachments/assets/5e729073-4625-4bd7-a98e-49fa861220f3" width="90%" />
</p>

<p align="center">
  <img width="1468" height="881" alt="image" src="https://github.com/user-attachments/assets/08122ade-c56e-422e-9fdb-6a325e91cdbc" />
</p>


<p align="center">
  <img width="1464" height="835" alt="image" src="https://github.com/user-attachments/assets/d231c0c6-9337-401f-8e3f-1aa0ce5e232d" />
</p>


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

### ⚓ `/routes`

| Method | Endpoint                    | Description                |
| ------ | --------------------------- | -------------------------- |
| GET    | `/routes`                   | Fetch all routes           |
| POST   | `/routes/:routeId/baseline` | Set a baseline route       |
| GET    | `/routes/comparison`        | Compare routes vs baseline |

### 🧮 `/compliance`

| Method | Endpoint                               | Description                         |
| ------ | -------------------------------------- | ----------------------------------- |
| GET    | `/compliance/cb?routeId&year`          | Compute Compliance Balance          |
| GET    | `/compliance/adjusted-cb?routeId&year` | Compute Adjusted Compliance Balance |

### 💰 `/banking`

| Method | Endpoint                        | Description          |
| ------ | ------------------------------- | -------------------- |
| GET    | `/banking/records?routeId&year` | Fetch banked entries |
| POST   | `/banking/bank`                 | Bank surplus         |
| POST   | `/banking/apply`                | Apply banked surplus |

### ⚓ `/pools`

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | `/pools` | Create a pool of ships |
| GET    | `/pools` | Fetch all pools        |

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

## 🧭 Frontend Tabs Overview

| 🗂️ Tab     | Description                           |
| ----------- | ------------------------------------- |
| **Routes**  | View and manage all routes            |
| **Compare** | Compare routes vs baseline            |
| **Banking** | Manage banking and surplus            |
| **Pooling** | Handle pooling and compliance sharing |

---

## 🤖 AI Agent Collaboration

* 🧠 **Gemini** → Setup, schema, and structure
* ⚙️ **GPT-5** → Reasoning, debugging, architecture
* 🧩 **Cursor** → Path cleanup & refactors
* 🎨 **Copilot** → Frontend & UI styling

📘 Read details: [`AGENT_WORKFLOW.md`](./AGENT_WORKFLOW.md)

---

## 💬 Reflection

Read about how AI agents co-built this project → [`REFLECTION.md`](./REFLECTION.md)

---

## 👨‍💻 Author

<p align="center">
<b>Sumit Kumar</b><br/>
Full-Stack Developer | AI-Driven Software Engineer<br/>
<a href="https://www.linkedin.com/in/sumit-kumar2004/">
  <img src="https://img.shields.io/badge/LinkedIn%20Profile-blue?style=for-the-badge&logo=linkedin&logoColor=white" />
</a><br/>
📧 sumit.kumar120664@gmail.com
</p>

---

## 🏁 Summary

AI agents like **Gemini**, **GPT-5**, **Cursor**, and **Copilot** helped build, debug, and refine the project — delivering a clean, maintainable, production-ready platform.

<p align="center">
  <img src="https://img.shields.io/badge/Code%20Quality-Excellent-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-Hexagonal-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Powered%20By-AI%20Agents-purple?style=for-the-badge" />
</p>

---
