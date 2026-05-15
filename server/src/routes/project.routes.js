const express  = require('express')
const router   = express.Router()
const { protect } = require('../middlewares/auth.middleware.js')

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  regenerateApiKey,
} = require('../controllers/project.controller.js')

// all project routes require login
router.use(protect)

router.route('/')
  .get(getProjects)      // GET    /api/projects
  .post(createProject)   // POST   /api/projects

router.route('/:id')
  .get(getProject)       // GET    /api/projects/:id
  .put(updateProject)    // PUT    /api/projects/:id
  .delete(deleteProject) // DELETE /api/projects/:id

router.post('/:id/regenerate-key', regenerateApiKey) // POST /api/projects/:id/regenerate-key

module.exports = router