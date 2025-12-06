const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Routes lel projets - Kol el routes yesta7kou authentification
router.route('/')
  .post(protect, createProject)      // Création projet
  .get(protect, getAllProjects);     // Jib kol el projets

router.route('/:id')
  .get(protect, getProjectById)      // Jib projet wa7ad
  .put(protect, updateProject)       // Modification projet
  .delete(protect, deleteProject);   // Suppression projet

module.exports = router;