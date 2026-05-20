const express    = require('express')
const router     = express.Router()
const { protect } = require('../middleware/auth')
const {
  createAlert,
  getAlerts,
  updateAlert,
  deleteAlert,
  toggleAlert,
} = require('../controllers/alert.controller')

router.use(protect)

router.route('/:projectId')
  .get(getAlerts)     // GET  /api/alerts/:projectId
  .post(createAlert)  // POST /api/alerts/:projectId

router.route('/:projectId/:alertId')
  .put(updateAlert)      // PUT    /api/alerts/:projectId/:alertId
  .delete(deleteAlert)   // DELETE /api/alerts/:projectId/:alertId

router.patch('/:projectId/:alertId/toggle', toggleAlert) // PATCH toggle on/off

module.exports = router