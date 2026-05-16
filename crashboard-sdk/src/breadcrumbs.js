const MAX_BREADCRUMBS = 10

// internal store — keeps the last 10 events
let breadcrumbs = []

const addBreadcrumb = (type, message) => {
  breadcrumbs.push({
    type,
    message,
    timestamp: new Date().toISOString(),
  })
  // keep only the last 10
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs = breadcrumbs.slice(-MAX_BREADCRUMBS)
  }
}

const getBreadcrumbs = () => [...breadcrumbs]

const clearBreadcrumbs = () => { breadcrumbs = [] }

// automatically record clicks
const trackClicks = () => {
  document.addEventListener('click', (e) => {
    const target = e.target
    const label  = target.innerText?.slice(0, 50)
      || target.getAttribute('aria-label')
      || target.tagName
    addBreadcrumb('click', `Clicked: ${label}`)
  }, { passive: true })
}

// automatically record navigation
const trackNavigation = () => {
  // record initial page
  addBreadcrumb('navigation', `Navigated to: ${window.location.pathname}`)

  // record pushState navigation (React Router etc)
  const originalPush = history.pushState.bind(history)
  history.pushState = (...args) => {
    originalPush(...args)
    addBreadcrumb('navigation', `Navigated to: ${window.location.pathname}`)
  }

  // record browser back/forward
  window.addEventListener('popstate', () => {
    addBreadcrumb('navigation', `Navigated to: ${window.location.pathname}`)
  })
}

export { addBreadcrumb, getBreadcrumbs, clearBreadcrumbs, trackClicks, trackNavigation }