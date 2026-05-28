#  CrashBoard

<div align="center">

**Real-Time Application Monitoring & Error Tracking Platform**

*A production-grade developer tool that captures crashes, errors, and performance issues from any JavaScript app and surfaces them on a live dashboard — with AI-powered debugging built in.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-crashboard--app.vercel.app-e8000d?style=for-the-badge&logo=vercel&logoColor=white)](https://crash-board.vercel.app/)
[![npm](https://img.shields.io/badge/npm-crashboard--sdk-e8000d?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/crashboard-sdk)
[![API Health](https://img.shields.io/badge/API-Live-00e05a?style=for-the-badge&logo=render&logoColor=white)](https://crashboard-api.onrender.com/api/health)
[![GitHub](https://img.shields.io/badge/GitHub-Source-0b0c0e?style=for-the-badge&logo=github&logoColor=white)](https://github.com/amansingh/crashboard)

![CrashBoard Dashboard](https://crash-board.vercel.app/)

</div>

---

##  What is CrashBoard?

CrashBoard is a **mini-Sentry** built entirely from scratch as a full-stack portfolio project. It demonstrates advanced MERN stack concepts including real-time communication, AI integration, npm package publishing, and production-level architecture.

> **The single biggest differentiator:** A real published npm package (`crashboard-sdk`) that other developers can install. At B.Tech level, almost no placement candidate has built and published their own npm package. This alone stops interviewers and leads to deeper technical conversations.

---

##  Features

| # | Feature | Description | Tech |
|---|---------|-------------|------|
| 1 | npm SDK | Published package — 3 lines to integrate | `rollup` · `npm publish` |
| 2 | Real-Time Feed | Live error streaming to dashboard | `Socket.io` · `<50ms` |
| 3 | AI Explainer | Gemini reads stack trace, writes the fix | `Gemini 1.5 Flash` |
| 4 | API Key Auth | Multi-project with UUID-based keys | `JWT` · `UUID v4` |
| 5 | Team Collaboration | Invite members, comments, assign errors | `Nodemailer` · `Socket.io` |
| 6 | Analytics Dashboard | Error trends, browser breakdown, resolution rate | `Recharts` |
| 7 | Smart Alerts | Email + Slack when threshold exceeded | `Nodemailer` · `Axios` |
| 8 | Session Replay | Last 10 user actions before crash | `PerformanceObserver` |
| 9 | Performance Monitoring | LCP, FCP, CLS, TTFB tracking | `PerformanceObserver` |
| 10 | Source Map Support | De-minifies stack traces automatically | `mozilla/source-map` |
| 11 | Error Deduplication | Groups identical errors, counts occurrences | `MD5 fingerprinting` |

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         TECH STACK                               │
├──────────────┬──────────────────────────────────────────────────┤
│ Frontend     │ React 18 · Vite · Recharts · Zustand · Socket.io │
│ Backend      │ Node.js · Express · MongoDB · Mongoose            │
│ Real-Time    │ Socket.io (rooms per project)                     │
│ Auth         │ JWT (7-day tokens) · UUID API Keys                │
│ AI           │ Google Gemini 1.5 Flash                           │
│ Email        │ Nodemailer (Gmail SMTP)                           │
│ Source Maps  │ mozilla/source-map · AWS S3 / local storage       │
│ SDK          │ crashboard-sdk (published to npm via Rollup)      │
│ Deploy       │ Vercel (FE) · Render (BE) · MongoDB Atlas         │
└──────────────┴──────────────────────────────────────────────────┘
```

---

##  Architecture

```
                        YOUR APP
                    (any JS frontend)
                          │
                          │  npm install crashboard-sdk
                          │  CrashBoard.init({ apiKey })
                          │
                          ▼
                ┌─────────────────────┐
                │   crashboard-sdk    │  ← window.onerror
                │   (npm package)     │  ← unhandledrejection
                │                     │  ← fetch interceptor
                │                     │  ← PerformanceObserver
                └──────────┬──────────┘
                           │
                           │  POST /api/ingest/:apiKey
                           │  (error payload + breadcrumbs + vitals)
                           ▼
                ┌─────────────────────┐
                │   Express Backend   │
                │   + MongoDB Atlas   │  ← fingerprint + deduplicate
                │                     │  ← de-minify via source-map
                │                     │  ← check alert thresholds
                └──────────┬──────────┘
                           │
                 ┌─────────┼──────────┐
                 │         │          │
                 ▼         ▼          ▼
           Socket.io   Nodemailer   Gemini API
           (live feed) (email alert) (AI explain)
                 │
                 ▼
        ┌─────────────────┐
        │ React Dashboard │
        │  (Vercel)       │  ← live errors stream in real-time
        │                 │  ← AI explanation on click
        │                 │  ← analytics + performance charts
        └─────────────────┘
```

---

##  Quick Start

### Use the SDK in your app

```bash
npm install crashboard-sdk
```

```javascript
// Add to your app's entry point (e.g. src/main.jsx)
import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',   // from Settings → Projects
  project:   'my-app',
  env:       'production',
  ingestUrl: 'https://crashboard-api.onrender.com/api/ingest'
})

// That's it! CrashBoard now auto-captures:
// ✓ TypeError, ReferenceError, SyntaxError
// ✓ Unhandled Promise rejections
// ✓ Network failures (fetch)
// ✓ Core Web Vitals (LCP, FCP, CLS, TTFB)
// ✓ Breadcrumb trail — last 10 user actions
```

```javascript
// Optional: manual capture in try/catch
try {
  await processPayment(user)
} catch (error) {
  CrashBoard.captureException(error)
}

// Optional: custom event tracking
CrashBoard.track('PaymentFailed', { userId, amount, method: 'UPI' })
```

---

##  Local Development

### Prerequisites

```
Node.js >= 18
MongoDB (local) or MongoDB Atlas (free)
Gmail account with App Password enabled
Google Gemini API key (free at aistudio.google.com)
```

### Clone and install

```bash
git clone https://github.com/amansingh/crashboard.git
cd crashboard
```

### Backend setup

```bash
cd server
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
#  Server running at http://localhost:5000
```

### Frontend setup

```bash
# New terminal
cd client
npm install
npm run dev
#  App running at http://localhost:5173
```

### SDK setup (optional — for local testing)

```bash
cd crashboard-sdk
npm install
npm run build
# dist/ folder created with CJS + ESM builds
```

---

##  Environment Variables

### Backend (`server/.env`)

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/crashboard

# Auth
JWT_SECRET=your_long_random_secret_here

# AI
GEMINI_API_KEY=AIzaSy_your_gemini_key

# Email alerts
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx    # Gmail App Password (not real password)

# CORS
CLIENT_URL=http://localhost:5173   # or Vercel URL in production

# Optional: AWS S3 for source maps
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=crashboard-sourcemaps
```

### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 📡 API Reference

All endpoints require `Authorization: Bearer <token>` except the ingest webhook.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List all projects |
| POST | `/api/projects` | Create project + generate API key |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/regenerate-key` | Rotate API key |

### Errors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/errors/:projectId` | List errors (paginated, filterable) |
| GET | `/api/errors/:projectId/:errorId` | Get error detail |
| PATCH | `/api/errors/:projectId/:errorId/status` | Resolve / ignore / reopen |
| POST | `/api/errors/:projectId/:errorId/explain` | Trigger Gemini AI analysis |
| GET | `/api/errors/:projectId/analytics` | Get analytics data |
| GET | `/api/errors/:projectId/performance` | Get Web Vitals data |

### Ingest (SDK webhook — no auth required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ingest/:apiKey` | Receive error from SDK |

### Alerts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts/:projectId` | List alert rules |
| POST | `/api/alerts/:projectId` | Create alert rule |
| PATCH | `/api/alerts/:projectId/:alertId/toggle` | Enable / pause alert |
| DELETE | `/api/alerts/:projectId/:alertId` | Delete alert |

### Team
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/team/:projectId/invite` | Send email invite |
| POST | `/api/team/accept-invite` | Accept invite (with token) |
| GET | `/api/team/:projectId/members` | List team members |
| DELETE | `/api/team/:projectId/members/:userId` | Remove member |
| POST | `/api/team/:projectId/errors/:errorId/comments` | Add comment |
| GET | `/api/team/:projectId/errors/:errorId/comments` | Get comments |

---

##  Project Structure

```
crashboard/
│
├── server/                    # Node.js + Express backend
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── env.js             # Environment variables
│   ├── models/
│   │   ├── User.js            # User schema (bcrypt password hashing)
│   │   ├── Project.js         # Project + API key schema
│   │   ├── Error.js           # Error record with fingerprint
│   │   ├── Alert.js           # Alert rule schema
│   │   ├── Comment.js         # Comment schema
│   │   └── SourceMap.js       # Source map metadata
│   ├── controllers/           # Route handlers
│   ├── routes/                # Express routers
│   ├── middleware/
│   │   ├── auth.js            # JWT protect middleware
│   │   └── validateApiKey.js  # API key validation
│   ├── services/
│   │   ├── socket.service.js  # Socket.io broadcasting
│   │   ├── gemini.service.js  # Gemini AI integration
│   │   ├── alert.service.js   # Email + Slack alerts
│   │   ├── sourcemap.service.js # Stack trace de-minification
│   │   └── fingerprint.service.js # MD5 error deduplication
│   ├── app.js                 # Express setup + routes
│   └── server.js              # HTTP server + Socket.io
│
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/               # Axios instance with interceptors
│       ├── store/             # Zustand global state
│       ├── hooks/             # useSocket (Socket.io hook)
│       ├── components/
│       │   ├── landing/       # Landing page components
│       │   └── dashboard/     # Dashboard components
│       └── pages/
│           ├── Landing.jsx    # Marketing homepage
│           ├── Auth.jsx       # Login + Signup
│           ├── NotFound.jsx   # 404 with glitch effect
│           ├── Features.jsx   # Features page
│           ├── Sdk.jsx        # SDK documentation
│           ├── Pricing.jsx    # Pricing + FAQ
│           ├── Docs.jsx       # Documentation
│           └── dashboard/
│               ├── Dashboard.jsx     # Main dashboard
│               ├── AllErrors.jsx     # Error table
│               ├── ErrorDetail.jsx   # 6-tab error detail
│               ├── Analytics.jsx     # Charts + insights
│               ├── Performance.jsx   # Web Vitals
│               ├── SourceMaps.jsx    # Upload + test
│               ├── Team.jsx          # Members + comments
│               └── Settings.jsx      # Projects + alerts
│
└── crashboard-sdk/            # npm package
    ├── src/
    │   ├── index.js           # CrashBoard.init() entry
    │   ├── errorCapture.js    # window.onerror + fetch hook
    │   ├── breadcrumbs.js     # User action recording
    │   ├── webVitals.js       # PerformanceObserver
    │   └── sender.js          # POST to ingest endpoint
    └── rollup.config.js       # CJS + ESM build config
```

---

##  Key Engineering Decisions

### Why MD5 fingerprinting for deduplication?
The same `TypeError: Cannot read property 'wallet' of undefined` from 1,000 users would create 1,000 MongoDB documents. Instead, we hash `type + message + stack[0:300]` to get a fingerprint. Identical errors find the existing record and increment `occurrences` — the dashboard shows "847×, 203 users" not 847 rows.

### Why Socket.io rooms per project?
If all errors were broadcast globally, every dashboard user would receive every other user's errors — a massive privacy and performance issue. Each project gets its own Socket.io room. When a team member opens the dashboard, they `emit('join_project', projectId)` and only receive errors for that project.

### Why cache Gemini responses in MongoDB?
Gemini API has rate limits and costs. Once we analyze a stack trace, the explanation is stored in `error.aiExplanation`. Subsequent clicks return the cached result instantly — no API call, no cost, no latency.

### Why rollup for the SDK build?
The SDK needs to ship in two formats — CommonJS (for Node.js / `require()`) and ESM (for React / `import`). Rollup handles this cleanly with a single config. Terser minifies the output so the SDK adds minimal weight to the app bundle.

---

##  Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://crashboard-app.vercel.app |
| Backend | Render | https://crashboard-api.onrender.com |
| Database | MongoDB Atlas | ap-south-1 (Mumbai) |
| npm Package | npm registry | https://npmjs.com/package/crashboard-sdk |

---

##  Author

**Aman Singh**
- 📧 amanscode2005@gmail.com

---

## 📄 License

MIT License — feel free to use this project as a reference or template.

---

<div align="center">

**Built with ❤️ as a placement portfolio project**

*If this helped you, please ⭐ star the repo!*

</div>
