# Requisti — Advertising Industry Directory

A full-stack directory platform for marketing and communication professionals in the MENA region.

- **Frontend**: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Firebase Auth
- **Backend**: Node.js · Express 4 · PostgreSQL · Drizzle ORM · TypeScript

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the repository](#clone-the-repository)
3. [Frontend setup](#frontend-setup)
4. [Backend setup](#backend-setup)
5. [Database setup](#database-setup)
6. [Seed dummy data](#seed-dummy-data)
7. [Running the apps](#running-the-apps)
8. [Test accounts](#test-accounts)
9. [Project structure](#project-structure)
10. [Environment variables reference](#environment-variables-reference)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Comes with Node.js |
| PostgreSQL | 14+ | Local install or Docker |
| Git | any | |

> **Docker alternative**: If you have Docker Desktop, you can start PostgreSQL with a single command instead of installing it locally (see [Database setup](#database-setup)).

---

## Clone the repository

```bash
git clone https://github.com/zainulabidin776/requisti-version.git
cd requisti-version
git checkout feature/firebase-integration
```

---

## Frontend setup

The frontend lives in the **root** of the `requisti-version/` folder.

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.local.example .env.local   # if example exists, otherwise create manually
```

Create `.env.local` in the project root with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000

# Firebase (client-side — already hardcoded in lib/firebase.ts, these are optional overrides)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDnyOHIr1v6WIgHNGZwx2ecAGmM8x69IRg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=requisti-version.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=requisti-version
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=requisti-version.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=298222069449
NEXT_PUBLIC_FIREBASE_APP_ID=1:298222069449:web:baa4e8d6df9264e2fa0b4c
```

### 3. Start the dev server

```bash
npm run dev
```

Frontend runs at **http://localhost:3000** (or **http://localhost:3001** if port 3000 is occupied).

---

## Backend setup

The backend lives in the `backend/` subfolder.

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

Then edit `backend/.env` and set your PostgreSQL password:

```env
DATABASE_URL=postgresql://postgres:YOUR_PG_PASSWORD@localhost:5432/requisti

# Firebase Admin SDK — only needed in production
# Get from: Firebase Console → Project Settings → Service Accounts → Generate new private key
FIREBASE_PROJECT_ID=requisti-version
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

PORT=4000
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3001

# Bypass Firebase token verification locally — use Bearer dev_<uid> tokens
DEV_MODE=true
```

---

## Database setup

### Option A — Local PostgreSQL

```bash
# Create the database (run once)
psql -U postgres -c "CREATE DATABASE requisti;"
```

### Option B — Docker

```bash
cd backend
docker-compose up -d
```

This starts `postgres:16-alpine` on port `5432` with:
- User: `postgres`
- Password: `requisti123`
- Database: `requisti`

> Update `DATABASE_URL` in `backend/.env` accordingly if using Docker defaults.

### Run migrations

From the `backend/` folder:

```bash
npm run db:generate   # generates SQL migration files from schema
npm run db:migrate    # applies migrations to the database
```

---

## Seed dummy data

```bash
cd backend
npm run seed
```

This inserts:
- 4 VA categories (Agencies, Production, Consulting, Media)
- 5 active agencies + 3 production companies + 1 pending registration
- 3 client companies (Unilever MENA, P&G Saudi Arabia, Nestlé Egypt)
- 4 internal users + 2 client users
- Disclaimer content and activity log entries

---

## Running the apps

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd requisti-version/backend
npm run dev
# API ready at http://localhost:4000
```

**Terminal 2 — Frontend:**
```bash
cd requisti-version
npm run dev
# App ready at http://localhost:3001
```

**Verify the backend is up:**
```bash
curl http://localhost:4000/health
# → { "status": "ok" }

curl http://localhost:4000/api/stats -H "Authorization: Bearer dev_superadmin-uid"
# → { "totalAgencies": 5, "totalProduction": 3, ... }
```

---

## Test accounts

All test accounts use password: **`password`**

| Email | Role | DEV_MODE token |
|-------|------|----------------|
| `superadmin@va-consulting.com` | Super Admin | `Bearer dev_superadmin-uid` |
| `admin@va-consulting.com` | Admin | `Bearer dev_admin-uid` |
| `demo@requisti.com` | Vendor / Agency | `Bearer dev_vendor-uid` |
| `client@requisti.com` | Client (Unilever MENA) | `Bearer dev_client-uid` |

> **Firebase requirement**: Email/Password sign-in must be enabled in [Firebase Console](https://console.firebase.google.com) → Authentication → Sign-in method → Email/Password.

### Role-based redirects after login

| Role | Redirects to |
|------|-------------|
| `super_admin` / `admin` | `/admin` |
| `vendor` | `/dashboard/vendor` |
| `client` | `/dashboard/client` |

---

## Project structure

```
requisti-version/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (agencies, clients, settings, etc.)
│   ├── dashboard/          # Role-based dashboards
│   ├── directory/          # Public agency/production directory
│   └── signup/             # Registration flows
├── components/             # Shared React components
├── lib/
│   ├── auth-context.tsx    # Firebase Auth context + test account bypass
│   ├── firebase.ts         # Firebase client-side initialisation
│   ├── admin-firestore.ts  # Firestore CRUD layer
│   └── api-client.ts       # Typed HTTP client for the Node.js backend
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts   # Drizzle ORM table definitions (10 tables)
│   │   │   └── index.ts    # pg Pool + Drizzle instance
│   │   ├── middleware/
│   │   │   ├── auth.ts     # Firebase Admin JWT verification + DEV_MODE bypass
│   │   │   └── error.ts    # Global error handler
│   │   ├── routes/         # Express route handlers
│   │   │   ├── stats.ts
│   │   │   ├── orgs.ts
│   │   │   ├── clients.ts
│   │   │   ├── users.ts
│   │   │   ├── registrations.ts
│   │   │   ├── settings.ts
│   │   │   └── activity.ts
│   │   ├── scripts/
│   │   │   └── seed.ts     # Dummy data seeder
│   │   └── index.ts        # Express app entry point
│   ├── .env.example        # Environment variable template
│   ├── docker-compose.yml  # PostgreSQL via Docker
│   ├── drizzle.config.ts   # Drizzle Kit config
│   └── package.json
└── public/
    └── logos/              # Agency/company logos
```

---

## Environment variables reference

### Frontend (`requisti-version/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend base URL (default: `http://localhost:4000`) |
| `NEXT_PUBLIC_FIREBASE_*` | Optional | Firebase client config (hardcoded fallbacks exist) |

### Backend (`requisti-version/backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | API port (default: `4000`) |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_ORIGIN` | No | CORS allowed origin (default: `http://localhost:3001`) |
| `DEV_MODE` | No | `true` to skip Firebase token verification locally |
| `FIREBASE_PROJECT_ID` | Production | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Production | Service account email |
| `FIREBASE_PRIVATE_KEY` | Production | Service account private key |

> **Getting Firebase service account credentials**: Firebase Console → Project Settings → Service Accounts → Generate new private key. Download the JSON and copy `client_email` and `private_key` into `.env`.
