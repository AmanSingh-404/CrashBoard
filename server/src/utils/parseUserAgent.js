// parses browser and OS from the user agent string
// e.g. "Mozilla/5.0 (Windows NT 10.0) AppleWebKit Chrome/120"
const parseUserAgent = (ua = '') => {
  let browser = 'Unknown'
  let os      = 'Unknown'

  // detect browser
  if (ua.includes('Firefox'))                          browser = 'Firefox'
  else if (ua.includes('Edg'))                         browser = 'Edge'
  else if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('MSIE') || ua.includes('Trident')) browser = 'IE'

  // detect OS
  if (ua.includes('Windows NT'))      os = 'Windows'
  else if (ua.includes('Mac OS X'))   os = 'macOS'
  else if (ua.includes('Android'))    os = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'
  else if (ua.includes('Linux'))      os = 'Linux'

  return { browser, os }
}

module.exports = { parseUserAgent }