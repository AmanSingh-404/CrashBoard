const express    = require('express')
const router     = express.Router()
const { protect } = require('../middlewares/auth.middleware.js')

const {
  getErrors,
  getError,
  updateErrorStatus,
  assignError,
  deleteError,
  getAnalytics,
  explainErrorAI,       // ← add this
} = require('../controllers/error.controller')

router.use(protect)

// analytics route first
router.get('/:projectId/analytics', getAnalytics)

router.route('/:projectId')
  .get(getErrors)

router.route('/:projectId/:errorId')
  .get(getError)
  .delete(deleteError)

router.patch('/:projectId/:errorId/status', updateErrorStatus)
router.patch('/:projectId/:errorId/assign', assignError)

// ── AI explainer ── (add this line)
router.post('/:projectId/:errorId/explain', explainErrorAI)

module.exports = router