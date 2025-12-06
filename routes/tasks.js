// routes/tasks.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// Use non-destructuring import to prevent potential circular dependency errors
const taskController = require('../controllers/taskController');

// Routes lel tâches
router.route('/')
  // .post(protect, createTask)  <-- Original, now use taskController.createTask
  .post(protect, taskController.createTask)       // nasen3ou (creation) tâche
  .get(protect, taskController.getAllTasks);      // Jib l tâches lkol

// Route besh naffectiw (ken manager)
router.put('/:id/assign', protect, authorize('manager'), taskController.assignTask);

router.route('/:id')
  .get(protect, taskController.getTaskById)       // Jib tâche wa7da
  .put(protect, taskController.updateTask)        // nmodifiiw tâche
  .delete(protect, taskController.deleteTask);    // Nams7ou tâche

module.exports = router;