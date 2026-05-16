import { captureErrors, captureException } from './errorCapture'
import { trackClicks, trackNavigation }    from './breadcrumbs'
import { collectWebVitals }                from './webVitals'

const CrashBoard = {
  // CrashBoard.init({ apiKey: 'cb_live_xxx', project: 'my-app', env: 'production' })
  init({ apiKey, project, env = 'production', ingestUrl = 'http://localhost:5000/api/ingest' }) {
    if (!apiKey) {
      console.error('[CrashBoard] apiKey is required')
      return
    }

    const config = { apiKey, project, env, ingestUrl }

    // start capturing errors
    captureErrors(config)

    // start recording user actions as breadcrumbs
    trackClicks()
    trackNavigation()

    // start collecting web vitals
    collectWebVitals()

    console.log(`[CrashBoard] ✓ Initialized · project: ${project} · env: ${env}`)
  },

  // CrashBoard.captureException(new Error('something broke'))
  captureException,

  // CrashBoard.track('PaymentFailed', { userId, amount })
  track(eventName, data = {}) {
    console.log(`[CrashBoard] Custom event: ${eventName}`, data)
    // can be extended to send custom events to backend
  },
}

export default CrashBoard