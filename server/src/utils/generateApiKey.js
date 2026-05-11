const { v4: uuidv4 } = require('uuid')

// generates a key like: cb_live_a1b2c3d4-e5f6-...
const generateApiKey = () => {
  return `cb_live_${uuidv4()}`
}

module.exports = generateApiKey