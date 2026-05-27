# 🚨 CrashBoard

> Real-time application monitoring & error tracking platform — a production-grade developer tool built with the MERN stack.

**Live Demo:** https://crashboard-app.vercel.app  
**npm SDK:** https://www.npmjs.com/package/crashboard-sdk  
**Backend API:** https://crashboard-api.onrender.com/api/health

---

## What is CrashBoard?

CrashBoard is a mini-Sentry built from scratch. It captures JavaScript errors the moment they fire in production and surfaces them on a live dashboard — with AI-powered debugging, session replay, and team collaboration built in.

---

## Features

| Feature | Description |
|---|---|
|  **npm SDK** | Published package — `npm install crashboard-sdk` |
|  **Real-time feed** | Socket.io broadcasts errors in <50ms |
|  **AI explainer** | Gemini reads stack trace, writes the fix |
|  **API key auth** | Multi-project with UUID-based API keys |
|  **Team collaboration** | Invite members, comments, assign errors |
|  **Analytics** | Recharts — error trends, browser breakdown |
|  **Smart alerts** | Email + Slack when threshold exceeded |
|  **Session replay** | Last 10 user actions before crash |
|  **Performance** | LCP, FCP, CLS, TTFB via PerformanceObserver |
|  **Source maps** | De-minifies stack traces automatically |
|  **Deduplication** | MD5 fingerprinting groups same errors |

---

## Tech Stack
