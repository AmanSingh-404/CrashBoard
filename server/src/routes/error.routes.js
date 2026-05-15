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
} = require('../controllers/error.controller')

// all error routes require login
router.use(protect)

// analytics must come BEFORE /:projectId/:errorId
// otherwise Express mistakes 'analytics' for an errorId
router.get('/:projectId/analytics', getAnalytics)

router.route('/:projectId')
  .get(getErrors)          // GET /api/errors/:projectId

router.route('/:projectId/:errorId')
  .get(getError)           // GET    /api/errors/:projectId/:errorId
  .delete(deleteError)     // DELETE /api/errors/:projectId/:errorId

router.patch('/:projectId/:errorId/status', updateErrorStatus)  // PATCH /api/errors/:projectId/:errorId/status
router.patch('/:projectId/:errorId/assign', assignError)        // PATCH /api/errors/:projectId/:errorId/assign

module.exports = router