# crashboard-sdk

Official JavaScript SDK for CrashBoard — a real-time error monitoring and performance tracking platform.

Capture unhandled errors, promise rejections, network failures, Core Web Vitals, and user session breadcrumbs automatically. Every event is sent to your CrashBoard dashboard in under 50ms via WebSocket.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [What Gets Captured Automatically](#what-gets-captured-automatically)
- [Manual Error Capture](#manual-error-capture)
- [Custom Event Tracking](#custom-event-tracking)
- [Framework Examples](#framework-examples)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [How It Works](#how-it-works)
- [Updating the Package on npm](#updating-the-package-on-npm)
- [License](#license)

---

## Requirements

- Node.js 18 or higher (for building)
- A CrashBoard account — [sign up free](https://crash-board.vercel.app/)
- A project API key from your CrashBoard Settings page

The SDK runs entirely in the browser. It has zero runtime dependencies and adds less than 5KB to your bundle.

---

## Installation

```bash
# npm
npm install crashboard-sdk

# yarn
yarn add crashboard-sdk

# pnpm
pnpm add crashboard-sdk
```

---

## Quick Start

Add this to your application's entry point — the file that runs first when your app loads.

```javascript
import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',
  project:   'my-app',
  env:       'production',
  ingestUrl: 'https://your-backend.onrender.com/api/ingest'
})
```

That is everything. CrashBoard now monitors your app automatically. No additional setup, no config files, no build changes required.

To confirm it is working, open your browser console and run:

```javascript
null.crash
```

Open your CrashBoard dashboard. The error appears within seconds.

---

## Configuration

Pass a config object to `CrashBoard.init()`. Only `apiKey` is required.

```javascript
CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',   // required — from Settings > Projects
  project:   'my-app',                // optional — label shown in dashboard
  env:       'production',            // optional — tags errors by environment
  ingestUrl: 'https://...',           // optional — your CrashBoard backend URL
})
```

### Config options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `apiKey` | string | Yes | — | Your project API key from CrashBoard Settings |
| `project` | string | No | `""` | Project name label for your own reference |
| `env` | string | No | `"production"` | Environment tag attached to every error record |
| `ingestUrl` | string | No | `http://localhost:5000/api/ingest` | Base URL of your CrashBoard backend |

### Getting your API key

1. Log in to your CrashBoard dashboard
2. Go to **Settings**
3. Under **Projects and API Keys**, find your project
4. Copy the key — it looks like `cb_live_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## What Gets Captured Automatically

Once you call `CrashBoard.init()`, the SDK hooks into the browser and captures the following without any additional code.

### JavaScript errors

All unhandled JavaScript errors are captured via `window.onerror`.

```
TypeError: Cannot read properties of undefined (reading 'wallet')
  at PaymentGateway.js:147
  at processPayment (app.js:89)
```

Captured automatically — no try/catch required.

### Unhandled promise rejections

Caught via the `unhandledrejection` event.

```javascript
// This is caught automatically
fetch('/api/data').then(res => res.json())
// If the fetch fails and nothing handles the rejection, CrashBoard captures it
```

### Network failures

The SDK wraps `window.fetch` to detect failed HTTP requests.

```javascript
// If this request fails with a network error, CrashBoard captures it
const response = await fetch('/api/transfer', { method: 'POST', body: data })
```

Successful requests with error status codes (4xx, 5xx) are recorded as breadcrumbs but not as error events.

### Session breadcrumbs

The last 10 user actions before any error are recorded and attached to the error report. This lets you see exactly what the user did before the crash — like a flight recorder.

Captured automatically:
- Click events (with element label)
- Navigation events (route changes via `history.pushState`)
- Failed network calls

Example breadcrumb trail on an error report:

```
[10] Clicked: Pay Now button
[9]  Navigated to: /payment
[8]  Clicked: Continue to checkout
[7]  Navigated to: /cart
     ...
[1]  POST /api/transfer failed  <- CRASH
```

### Core Web Vitals

Collected via the `PerformanceObserver` API and attached to every error report.

| Metric | Full Name | Good threshold |
|--------|-----------|----------------|
| LCP | Largest Contentful Paint | under 2500ms |
| FCP | First Contentful Paint | under 1800ms |
| CLS | Cumulative Layout Shift | under 0.1 |
| TTFB | Time to First Byte | under 800ms |

These are visible in the **Performance** tab and on the **Error Detail** page in your dashboard.

---

## Manual Error Capture

Use `CrashBoard.captureException()` inside try/catch blocks to manually capture errors that you handle in code.

```javascript
try {
  const result = await processPayment(user, amount)
} catch (error) {
  // Send to CrashBoard, then handle gracefully for the user
  CrashBoard.captureException(error)
  showUserFriendlyErrorMessage()
}
```

This is useful for errors you intentionally catch — they would otherwise never reach `window.onerror`.

```javascript
// Works with any Error object
CrashBoard.captureException(new Error('Payment processor timeout'))

// Works with caught errors from async functions
async function loadUserData(userId) {
  try {
    return await api.get(`/users/${userId}`)
  } catch (error) {
    CrashBoard.captureException(error)
    return null
  }
}
```

---

## Custom Event Tracking

Use `CrashBoard.track()` to send custom business events to your dashboard alongside error data.

```javascript
CrashBoard.track('PaymentFailed', {
  userId:    user.id,
  amount:    transaction.amount,
  currency:  'INR',
  method:    'UPI',
  reason:    error.message,
})
```

```javascript
CrashBoard.track('CheckoutAbandoned', {
  cartValue: cart.total,
  itemCount: cart.items.length,
  step:      'payment',
})
```

```javascript
CrashBoard.track('FeatureUsed', {
  feature:   'dark-mode',
  userId:    user.id,
})
```

Custom events appear in your dashboard under the project feed and can be used to correlate business events with errors.

---

## Framework Examples

### React (Vite)

```javascript
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey:    import.meta.env.VITE_CRASHBOARD_KEY,
  project:   'my-react-app',
  env:       import.meta.env.MODE,
  ingestUrl: import.meta.env.VITE_CRASHBOARD_URL,
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

```bash
# .env
VITE_CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx
VITE_CRASHBOARD_URL=https://your-backend.onrender.com/api/ingest
```

### Next.js (App Router)

```javascript
// app/layout.jsx
'use client'
import { useEffect } from 'react'
import CrashBoard from 'crashboard-sdk'

export default function RootLayout({ children }) {
  useEffect(() => {
    CrashBoard.init({
      apiKey:    process.env.NEXT_PUBLIC_CRASHBOARD_KEY,
      project:   'my-nextjs-app',
      env:       process.env.NODE_ENV,
      ingestUrl: process.env.NEXT_PUBLIC_CRASHBOARD_URL,
    })
  }, [])

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```bash
# .env.local
NEXT_PUBLIC_CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx
NEXT_PUBLIC_CRASHBOARD_URL=https://your-backend.onrender.com/api/ingest
```

### Next.js (Pages Router)

```javascript
// pages/_app.jsx
import { useEffect } from 'react'
import CrashBoard from 'crashboard-sdk'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      CrashBoard.init({
        apiKey:    process.env.NEXT_PUBLIC_CRASHBOARD_KEY,
        project:   'my-nextjs-app',
        env:       process.env.NODE_ENV,
        ingestUrl: process.env.NEXT_PUBLIC_CRASHBOARD_URL,
      })
    }
  }, [])

  return <Component {...pageProps} />
}
```

### Vanilla JavaScript

```html
<!-- index.html -->
<script type="module">
  import CrashBoard from 'https://cdn.jsdelivr.net/npm/crashboard-sdk/dist/index.esm.js'

  CrashBoard.init({
    apiKey:    'cb_live_xxxxxxxxxxxx',
    project:   'my-vanilla-app',
    env:       'production',
    ingestUrl: 'https://your-backend.onrender.com/api/ingest',
  })
</script>
```

Or with a bundler:

```javascript
// main.js
const CrashBoard = require('crashboard-sdk')

CrashBoard.init({
  apiKey:    'cb_live_xxxxxxxxxxxx',
  project:   'my-app',
  env:       'production',
  ingestUrl: 'https://your-backend.onrender.com/api/ingest',
})
```

---

## Environment Variables

Never hard-code your API key in source code. Use environment variables and add them to `.gitignore`.

```bash
# React / Vite (.env)
VITE_CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx
VITE_CRASHBOARD_URL=https://your-backend.onrender.com/api/ingest

# Next.js (.env.local)
NEXT_PUBLIC_CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx
NEXT_PUBLIC_CRASHBOARD_URL=https://your-backend.onrender.com/api/ingest

# Node.js (.env)
CRASHBOARD_KEY=cb_live_xxxxxxxxxxxx
CRASHBOARD_URL=https://your-backend.onrender.com/api/ingest
```

Add `.env` and `.env.local` to your `.gitignore` file so your keys are never committed to version control.

---

## API Reference

### `CrashBoard.init(config)`

Initializes the SDK. Must be called once before any other method. Best placed at the very top of your app's entry file.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | Yes | Configuration object (see Config options above) |

**Returns** `void`

---

### `CrashBoard.captureException(error)`

Manually sends an error to your CrashBoard dashboard.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `error` | Error or string | Yes | The error object or message to capture |

**Returns** `void`

**Example**

```javascript
CrashBoard.captureException(new Error('Something went wrong'))

// Or with a caught error
try {
  riskyOperation()
} catch (err) {
  CrashBoard.captureException(err)
}
```

---

### `CrashBoard.track(eventName, data)`

Sends a custom named event to your dashboard.

**Parameters**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `eventName` | string | Yes | Name of the event, e.g. `"PaymentFailed"` |
| `data` | object | No | Any additional key-value context |

**Returns** `void`

**Example**

```javascript
CrashBoard.track('UserUpgraded', {
  fromPlan: 'hobby',
  toPlan:   'pro',
  userId:   user.id,
})
```

---

## How It Works

When you call `CrashBoard.init()`, the SDK does four things:

**1. Hooks into browser error events**

```
window.onerror          -> catches TypeError, ReferenceError, SyntaxError etc.
window.unhandledrejection -> catches unhandled Promise rejections
window.fetch (wrapped)  -> catches network failures
```

**2. Starts recording breadcrumbs**

Every click, navigation, and failed network call is added to an in-memory queue capped at 10 items. When an error fires, the current breadcrumbs are attached to the error payload.

**3. Starts collecting Web Vitals**

`PerformanceObserver` listens for LCP, FCP, CLS, and TTFB. Values are stored in memory and attached to error payloads.

**4. Sends error payloads to your backend**

When an error is caught, the SDK builds a payload and POSTs it to your ingest endpoint:

```javascript
// Payload structure
{
  type:        'TypeError',
  message:     "Cannot read properties of undefined (reading 'wallet')",
  stack:       'TypeError: ...\n  at PaymentGateway.js:147',
  environment: 'production',
  userAgent:   'Mozilla/5.0 ...',
  url:         'https://myapp.com/payment',
  breadcrumbs: [
    { type: 'click',      message: 'Clicked: Pay Now', timestamp: '...' },
    { type: 'navigation', message: 'Navigated to: /payment', timestamp: '...' },
  ],
  webVitals: {
    lcp:  2400,
    fcp:  1100,
    cls:  0.05,
    ttfb: 380,
  }
}
```

The backend validates the API key, de-duplicates the error via MD5 fingerprinting, de-minifies the stack trace if a source map is uploaded, broadcasts the error to the dashboard via Socket.io, and checks alert thresholds.

---

## Updating the Package on npm

Follow these steps every time you want to publish a new version.

### Step 1 — Make your changes

Edit the source files inside `src/`. The built files in `dist/` are generated automatically — never edit them directly.

### Step 2 — Rebuild the package

```bash
npm run build
```

This runs Rollup and outputs two files:
- `dist/index.js` — CommonJS build for `require()`
- `dist/index.esm.js` — ES Module build for `import`

### Step 3 — Update the version number

npm requires a new version number for every publish. Open `package.json` and increment the version following semantic versioning:

```json
{
  "version": "1.0.1"
}
```

**Semantic versioning rules**

| Change type | What to increment | Example |
|-------------|-------------------|---------|
| Bug fix | Patch (third number) | `1.0.0` to `1.0.1` |
| New feature, backwards compatible | Minor (second number) | `1.0.0` to `1.1.0` |
| Breaking change | Major (first number) | `1.0.0` to `2.0.0` |

Or use the npm version command to do this automatically:

```bash
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0
```

### Step 4 — Log in to npm (first time only)

```bash
npm login
```

This opens a browser. Log in with your npm account credentials and complete 2FA if enabled.

Or use an access token:

```bash
# Create a token at npmjs.com -> Account -> Access Tokens -> Generate New Token -> Classic -> Publish
echo "//registry.npmjs.org/:_authToken=YOUR_TOKEN" > .npmrc
```

### Step 5 — Publish

```bash
npm publish --access public
```

You will see output like:

```
npm notice Publishing to https://registry.npmjs.org/ with tag latest and public access
+ crashboard-sdk@1.0.1
```

### Step 6 — Verify

```bash
npm view crashboard-sdk
```

Or visit `https://www.npmjs.com/package/crashboard-sdk` to confirm the new version is live.

### Step 7 — Update apps using the SDK

In any project that uses `crashboard-sdk`, run:

```bash
npm update crashboard-sdk

# Or install the specific version
npm install crashboard-sdk@1.0.1
```

### Common publish errors

**E403 Forbidden — 2FA required**

Generate a Publish access token from your npm account settings and add it to `.npmrc` as shown in Step 4.

**E403 Forbidden — package name taken**

The package name is already claimed by someone else. Rename it in `package.json` and use a scoped name:

```json
{
  "name": "@yourusername/crashboard-sdk"
}
```

Then publish with:

```bash
npm publish --access public
```

**E409 — version already exists**

You cannot overwrite an already published version. Increment the version number in `package.json` and publish again.

---

## Browser Support

| Browser | Minimum version |
|---------|----------------|
| Chrome | 61+ |
| Firefox | 60+ |
| Safari | 12+ |
| Edge | 79+ |

Web Vitals collection requires `PerformanceObserver` support. In browsers that do not support it, the SDK still captures JavaScript errors and breadcrumbs — it silently skips the vitals collection.

---

## Security

- Never commit your API key to version control
- Store keys in environment variables only
- API keys can be regenerated from the Settings page at any time if compromised
- The ingest endpoint accepts POST requests from any origin by design — the API key is the authentication mechanism

---

## License

MIT

---

## Links

- Dashboard: https://crashboard-app.vercel.app
- Documentation: https://crashboard-app.vercel.app/docs
- Source code: https://github.com/amansingh/crashboard
- npm package: https://www.npmjs.com/package/crashboard-sdk
- Report issues: https://github.com/amansingh/crashboard/issues