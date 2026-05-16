// sends error payload to the CrashBoard ingest endpoint
const sendError = async (apiKey, ingestUrl, payload) => {
  try {
    await fetch(`${ingestUrl}/${apiKey}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
  } catch (err) {
    // silently fail — never let the SDK crash the user's app
    console.warn('[CrashBoard] Failed to send error:', err.message)
  }
}

export { sendError }