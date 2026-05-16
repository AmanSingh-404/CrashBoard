let vitals = {}

const collectWebVitals = () => {
  // only works in browsers that support PerformanceObserver
  if (typeof PerformanceObserver === 'undefined') return

  // ── LCP (Largest Contentful Paint)
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const last    = entries[entries.length - 1]
      vitals.lcp = Math.round(last.startTime)
    }).observe({ type: 'largest-contentful-paint', buffered: true })
  } catch (e) {}

  // ── FCP (First Contentful Paint)
  try {
    new PerformanceObserver((list) => {
      const entry = list.getEntriesByName('first-contentful-paint')[0]
      if (entry) vitals.fcp = Math.round(entry.startTime)
    }).observe({ type: 'paint', buffered: true })
  } catch (e) {}

  // ── CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0
    new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) clsValue += entry.value
      })
      vitals.cls = Math.round(clsValue * 1000) / 1000
    }).observe({ type: 'layout-shift', buffered: true })
  } catch (e) {}

  // ── TTFB (Time to First Byte)
  try {
    const nav = performance.getEntriesByType('navigation')[0]
    if (nav) vitals.ttfb = Math.round(nav.responseStart)
  } catch (e) {}
}

const getWebVitals = () => ({ ...vitals })

export { collectWebVitals, getWebVitals }