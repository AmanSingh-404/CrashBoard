const crypto = require('crypto')

// creates a short unique hash from error message + stack trace
// same error from 1000 users = same fingerprint = one grouped record
const generateFingerprint = (type, message, stack = '') => {
  // take first 300 chars of stack — enough to be unique, not too long
  const stackSignature = stack.slice(0, 300)
  const raw = `${type}::${message}::${stackSignature}`
  return crypto.createHash('md5').update(raw).digest('hex')
}

module.exports = { generateFingerprint }