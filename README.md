# PromptVault

A monorepo for the PromptVault app: **apps/web** (React + Vite) and **apps/api** (Express + MongoDB).

## Prerequisites

- Node.js 18+
- MongoDB (local instance, [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), or Docker)

## Run MongoDB with Docker

To run only MongoDB in a container (recommended if you don’t have it installed locally):

```bash
docker compose up -d
```

This starts MongoDB 7 on **localhost:27017** and creates a volume for data. Use `MONGODB_URI=mongodb://localhost:27017/prompt-hub` in `apps/api/.env`.

Stop and remove the container (data is kept in the volume):

```bash
docker compose down
```

## Run locally

1. **Install dependencies** (from repo root):

   ```bash
   npm install
   ```

2. **Configure environment**

   - **API** – In `apps/api`, copy `.env.example` to `.env` and set:
     - `MONGODB_URI` – e.g. `mongodb://localhost:27017/prompt-hub` or your Atlas connection string
     - `PORT` – optional, default `4000`
   - **Web** – In `apps/web`, copy `.env.example` to `.env` if you need `VITE_API_URL` (leave empty when using the Vite proxy in dev).

3. **Start the API** (terminal 1):

   ```bash
   npm run dev:api
   ```

   Ensure MongoDB is running. The API will listen on `http://localhost:4000`.

4. **Start the web app** (terminal 2):

   ```bash
   npm run dev:web
   ```

   The app will be at `http://localhost:3000` and will proxy `/api` requests to the API.

   Or run both with:

   ```bash
   npm run dev
   ```

## Scripts (from root)

| Script       | Description                    |
| ------------ | ------------------------------ |
| `npm run dev` | Runs both API and web in parallel |
| `npm run dev:api` | Runs the Express API only    |
| `npm run dev:web` | Runs the Vite dev server only |
| `npm run build` | Builds both API and web      |
| `npm run build:api` | Builds the API (TypeScript) |
| `npm run build:web` | Builds the web app for production |

## Project structure

```
prompt-hub/
├── apps/
│   ├── api/          # Express + Mongoose, /api/prompts
│   └── web/          # React + Vite + Tailwind
├── package.json      # Workspaces root
```

## API

- `GET /api/prompts` – List prompts (query: `category`, `sort`, `page`, `limit`, `q`)
- `GET /api/prompts/:id` – Get one prompt
- `POST /api/prompts` – Create prompt
- `PATCH /api/prompts/:id/vote` – Vote up/down (`body: { direction: "up" | "down" }`)
- `GET /api/prompts/by-ids?ids=id1,id2` – Batch fetch by IDs (e.g. favorites/recent)
- `GET /api/health` – Health check
