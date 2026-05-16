import { getBreadcrumbs, clearBreadcrumbs, addBreadcrumb } from './breadcrumbs'
import { getWebVitals }  from './webVitals'
import { sendError }     from './sender'

let config = {}

const buildPayload = (type, message, stack) => ({
  type,
  message,
  stack,
  environment: config.env        || 'production',
  userAgent:   navigator.userAgent,
  url:         window.location.href,
  breadcrumbs: getBreadcrumbs(),
  webVitals:   getWebVitals(),
})

const captureErrors = (cfg) => {
  config = cfg

  // ── capture unhandled JS errors (TypeError, ReferenceError etc)
  window.onerror = (message, source, lineno, colno, error) => {
    const payload = buildPayload(
      error?.name    || 'Error',
      message,
      error?.stack   || `${source}:${lineno}:${colno}`,
    )
    sendError(config.apiKey, config.ingestUrl, payload)
    clearBreadcrumbs()
    return false  // don't suppress the error in console
  }

  // ── capture unhandled Promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error   = event.reason
    const payload = buildPayload(
      'UnhandledPromiseRejection',
      error?.message || String(error),
      error?.stack   || '',
    )
    sendError(config.apiKey, config.ingestUrl, payload)
    clearBreadcrumbs()
  })

  // ── capture failed network requests via fetch monkey-patch
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    try {
      const response = await originalFetch(...args)
      if (!response.ok) {
        addBreadcrumb('api_call', `${response.status} ${args[0]}`)
      }
      return response
    } catch (err) {
      const payload = buildPayload(
        'NetworkError',
        `fetch failed: ${args[0]}`,
        err?.stack || '',
      )
      sendError(config.apiKey, config.ingestUrl, payload)
      throw err  // re-throw so the app still handles it
    }
  }
}

// manual capture — for try/catch blocks
const captureException = (error) => {
  const payload = buildPayload(
    error?.name    || 'Error',
    error?.message || String(error),
    error?.stack   || '',
  )
  sendError(config.apiKey, config.ingestUrl, payload)
}

export { captureErrors, captureException }