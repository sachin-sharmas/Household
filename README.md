# Household Grocery Management System

Household Grocery Management System is a shared grocery and food inventory dashboard built with React, Node, Express, and MongoDB. Any household member can add items, assign who's bringing them, track status, and admins manage users and every item from a dedicated panel.

## What is included

- JWT auth in an httpOnly cookie, with rate-limited login/register endpoints.
- Shared item list: add, edit, delete, assign, search, filter by status/date, paginate.
- Personal views: "My Items" (requested by or assigned to you) and "My Assigned" (things you need to bring).
- Admin panel: manage users (including creating new accounts), remove users, edit/delete any item.
- Assignment notifications:
  - **Browser push (Web Push)** — opt-in bell toggle in the app; when someone assigns an item to you, you get a Chrome/browser notification that opens "My Assigned" on click. Requires VAPID keys (see below).
  - **Email** — sent to the assignee via SMTP (skipped with a log warning if SMTP isn't configured).
  - **SMS (Twilio)** — wired but currently disabled (paid account setup pending); see `server/src/utils/sms.js`.
  - Self-assigned items don't trigger notifications.
- Layered Express backend (routes → validators → controllers → models) with zod request validation,
  centralized error handling, helmet + compression + rate limiting, and production fail-fast
  config checks.
- React frontend with `react-router-dom` (lazy-loaded routes), a typed API layer per resource,
  data-fetching custom hooks separating network logic from UI, and a mobile-friendly UI
  (responsive login page, bottom nav on small screens, service worker for push).

## Tech stack

| Layer    | Tech                                                                                  |
| -------- | ------------------------------------------------------------------------------------- |
| Frontend | React 19, Vite 6, Tailwind CSS 4, react-router-dom 7, lucide-react icons               |
| Backend  | Node 20+, Express 4, Mongoose 8, zod, jsonwebtoken, bcryptjs, web-push, nodemailer     |
| Security | helmet, express-rate-httpOnlimit, ly cookie auth, CORS locked to `CLIENT_URL`          |
| Deploy   | Dockerfiles for both apps (nginx serves the client with gzip + SPA fallback), compose  |

## Project structure

```
server/src/
  app.js            Express app wiring (middleware, routes) — no listen()
  server.js         Entrypoint: connects DB, seeds defaults, starts listening, graceful shutdown
  config/           env.js (parsed/validated env vars, fails fast in production), db.js (Mongo connection)
  constants/        Roles, cookie name, item statuses
  controllers/      Request handlers per resource (auth, items, users, admin, push)
  middleware/       auth, database-readiness, rate limiting, centralized error handling, zod validation
  models/           Mongoose schemas (User, Item, PushSubscription)
  routes/           Thin Express routers, mounted via routes/index.js
  seed/             Default admin seeding
  utils/            ApiError, catchAsync, jwt helpers, push (web-push), mail, sms, logger,
                    date-range/regex-escape/item-query helpers
  validators/       zod request schemas

client/
  public/           sw.js (push service worker), icons/ (notification icon)
  src/
    api/            Fetch wrapper + one module per resource (auth/items/users/admin/push)
    components/     layout/ (AppShell), items/ (card, list row, form, filter toolbar, list section),
                    admin/ (user form), common/ (modal, empty state, loaders, error boundary)
    context/        AuthContext
    hooks/          useItems, useAdminData, useUsers, useDebouncedValue, usePushNotifications
    pages/          AuthPage, DashboardPage, MyItemsPage, MyAssignedPage, AdminPage, NotFoundPage
    routes/         ProtectedRoute, PublicRoute
    utils/          date formatting, query-string builder, push helpers (subscribe/unsubscribe)
```

## Local development

Install dependencies:

```bash
npm run install:all
```

Create environment files:

```bash
copy server\.env.example server\.env
copy client\.env.example client\.env
```

Update `server/.env` with your MongoDB connection, a real secret, and push keys:

```env
MONGO_URI=mongodb://127.0.0.1:27017/household_grocery
JWT_SECRET=use-a-long-random-secret

# Browser push notifications — generate once with: npx web-push generate-vapid-keys
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:you@yourdomain.com
```

Run the app:

```bash
npm run dev
```

Frontend: `https://household-six-blush.vercel.app/`
Backend: `http://localhost:5000`

## Default Admin

After MongoDB is connected, the server seeds this admin account on startup (only if it doesn't already exist):

```text
admin@grocery.com
Admin@12345
```

Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `server/.env` before first startup if you want different credentials.

The login page's "Login as Admin" quick-access button and the backup-password hint are shown
automatically in development builds only. Production builds hide them unless you opt in via
`VITE_DEMO_ADMIN_EMAIL`, `VITE_DEMO_ADMIN_PASSWORD`, and `VITE_BACKUP_USER_PASSWORD` in
`client/.env` — no credentials are baked into the production bundle by default.

## Browser push notifications

1. Set the three `VAPID_*` variables in `server/.env` (generate a key pair with `npx web-push generate-vapid-keys`).
2. Log in and click the bell ("Notifications off") in the sidebar (desktop) or top bar (mobile), then allow notifications when the browser asks.
3. When another member adds or reassigns an item to you, every browser/device where you enabled the bell gets a notification — clicking it opens "My Assigned".

Notes:

- Push requires a secure context: works on `localhost` in dev and HTTPS in production.
- Notifications arrive only while the browser is running (a platform limitation); email is the fallback once SMTP is configured.
- Expired/revoked subscriptions are pruned automatically, and a user's subscriptions are deleted when an admin removes the user.

## API overview

All routes are prefixed with `/api` and (except register/login and `/health`) require the auth cookie.

| Area  | Routes                                                                                     |
| ----- | ------------------------------------------------------------------------------------------ |
| Auth  | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`             |
| Items | `GET /items`, `GET /items/stats`, `POST /items`, `PUT /items/:id`, `DELETE /items/:id`     |
| Users | `GET /users` (assignee picker)                                                             |
| Push  | `GET /push/public-key`, `POST /push/subscribe`, `POST /push/unsubscribe`                   |
| Admin | `GET/POST /admin/users`, `PATCH/DELETE /admin/users/:id`, `GET /admin/items`, `GET /admin/stats` |
| Misc  | `GET /health` (liveness + DB status)                                                       |

## Deploying to production

### Required environment variables (server)

In production (`NODE_ENV=production`) the server **fails fast at startup** if `JWT_SECRET` or `MONGO_URI` are missing — set every variable in `server/.env.example` before deploying. Also set `COOKIE_SECURE=true` once the app is served over HTTPS, `CLIENT_URL` to your deployed frontend origin (used for CORS), and the `VAPID_*` keys if you want push notifications.

### Option A — Docker

Each app has its own `Dockerfile`:

```bash
# Backend
cd server
docker build -t household-grocery-server .
docker run -p 5000:5000 --env-file .env household-grocery-server

# Frontend (bakes the API URL in at build time)
cd client
docker build --build-arg VITE_API_URL=https://your-api.example.com/api -t household-grocery-client .
docker run -p 8080:80 household-grocery-client
```

Or bring both up together for local prod-parity testing:

```bash
docker compose up --build
```

### Option B — Vercel (frontend) + Render (backend), recommended

Deploy the backend first so you have its URL for the frontend build.

**Backend on Render** — the repo includes a `render.yaml` Blueprint:

1. Render dashboard → **New → Blueprint** → pick this repo. It creates the service with root
   directory `server`, `npm ci` / `npm start`, health check `/api/health`, and generates
   `JWT_SECRET` for you.
2. Fill in the `sync: false` env vars on the dashboard: `MONGO_URI`, `CLIENT_URL` (your Vercel
   URL once you have it), `VAPID_*`, `ADMIN_EMAIL` / `ADMIN_PASSWORD`, `BACKUP_USER_PASSWORD`.
   (Or skip the Blueprint and create a plain Web Service with the same settings.)
3. **Keep-alive**: Render's free tier sleeps after ~15 minutes of inactivity. The server
   detects Render's `RENDER_EXTERNAL_URL` automatically and pings its own `/api/health` every
   10 minutes to stay awake — no extra setup. On other hosts, set `KEEP_ALIVE_URL` to the
   API's public URL to enable the same behavior.

**Frontend on Vercel** — the repo includes `client/vercel.json` (SPA rewrite so React Router
routes survive refresh, and no-cache for the push service worker):

1. Vercel → **Add New → Project** → import this repo → set **Root Directory** to `client`
   (framework Vite is auto-detected).
2. Add env var `VITE_API_URL=https://<your-service>.onrender.com/api`.
3. Deploy, then put the final Vercel URL into `CLIENT_URL` on Render. `CLIENT_URL` accepts a
   comma-separated list if you also want to allow Vercel preview URLs.

### Option C — any other host

- **Backend**: any Node host (Railway, Fly.io, etc.). Build command `npm install`, start command `npm start`, expose `PORT`. The app trusts the first proxy hop (`trust proxy`) so it works correctly behind a load balancer.
- **Frontend**: any static host (Netlify, Cloudflare Pages). Build command `npm run build`, output directory `dist`, and set `VITE_API_URL` as a build-time env var pointing at your deployed backend. Configure SPA fallback (rewrite all routes to `/index.html`) since this is a client-routed app.
