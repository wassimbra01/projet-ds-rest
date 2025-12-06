// controllers/taskController.js
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Création tâche jdida
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { titre, description, statut, deadline, projet } = req.body;

    // nthabtou est ce que el champs el lazma mawjoudin
    if (!titre || !projet) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and project are required' 
      });
    }

    // nthabtou est ce que  el projet mawjoud
    const projectExists = await Project.findById(projet);
    if (!projectExists) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project unfound' 
      });
    }

    // nverifiw el statut
    if (statut && !['todo', 'doing', 'done'].includes(statut)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be todo, doing, or done' 
      });
    }

    // na3mlou el tâche jdida
    const task = await Task.create({
      titre,
      description,
      statut: statut || 'todo',
      deadline,
      projet
    });

    res.status(201).json({
      success: true,
      message: 'Tâche created successfully',
      data: task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Jib kol el tâches
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = async (req, res) => {
  try {
    let query;

    // ida manager, ychouf kol el tâches
    if (req.user.role === 'manager') {
      query = Task.find();
    } else {
      // ida user 3adi, ychouf el tâches ta3 projets mte3ou
      const userProjects = await Project.find({ proprietaire: req.user._id });
      const projectIds = userProjects.map(p => p._id);
      query = Task.find({ projet: { $in: projectIds } });
    }

    // Recherche par titre
    if (req.query.titre) {
      query = query.find({ titre: { $regex: req.query.titre, $options: 'i' } });
    }

    // Filtre par statut
    if (req.query.statut) {
      query = query.find({ statut: req.query.statut });
    }

    // Filtre par projet
    if (req.query.projet) {
      query = query.find({ projet: req.query.projet });
    }

    // Filtre par utilisateur assigné 
    if (req.query.utilisateur) {
      query = query.find({ utilisateurAssigne: req.query.utilisateur });
    }

    // Tri 
    const sortBy = req.query.sortBy || '-dateCreation';
    query = query.sort(sortBy);

    // npopuliw el projet w el utilisateur assigné
    query = query.populate('projet', 'nomProjet')
                 .populate('utilisateurAssigne', 'nom login');

    const tasks = await query;

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Jib tâche wa7da
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('projet', 'nomProjet proprietaire')
      .populate('utilisateurAssigne', 'nom login');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task unfound' 
      });
    }

    // nthabtouu fel permissions
    if (req.user.role !== 'manager' && task.projet.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view this task' 
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Modification tâche
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id).populate('projet');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task unfound' 
      });
    }

    // nthabtouu fel permissions
    if (req.user.role !== 'manager' && task.projet.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this task' 
      });
    }

    // nverifiw el statut
    if (req.body.statut && !['todo', 'doing', 'done'].includes(req.body.statut)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be todo, doing, or done' 
      });
    }

    // nbaddlou el tâche
    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('projet', 'nomProjet')
     .populate('utilisateurAssigne', 'nom login');

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Affectation tâche à utilisateur
// @route   PUT /api/tasks/:id/assign
// // @access  Private (Manager only)
exports.assignTask = async (req, res) => {
  try {
    const { utilisateurId } = req.body;

    if (!utilisateurId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { utilisateurAssigne: utilisateurId },
      { new: true, runValidators: true }
    ).populate('projet', 'nomProjet')
     .populate('utilisateurAssigne', 'nom login');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task unfound' 
      });
    }

    res.json({
      success: true,
      message: 'Task assigned to user successfully',
      data: task
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Suppression tâche
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projet');

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: 'Tâche unfound' 
      });
    }

    // n7arkou el permissions
    if (req.user.role !== 'manager' && task.projet.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this task' 
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};