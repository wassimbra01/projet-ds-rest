const Project = require('../models/Project');

// @desc    Création projet jdid
// @route   POST /api/projects
// @access  Private
exports.createProject = async (req, res) => {
  try {
    const { nomProjet, description, statut } = req.body;

    // nthabtou ken  esm el projet mawjoud
    if (!nomProjet) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project name is required' 
      });
    }

    // na3mlou el projet jdid
    const project = await Project.create({
      nomProjet,
      description,
      statut: statut || 'en cours',
      proprietaire: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Projet cree m3a so77a',
      data: project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Jib kol el projets
// @route   GET /api/projects
// @access  Private
exports.getAllProjects = async (req, res) => {
  try {
    let query;

    // ken el user manager, ychouf kol el projets
    if (req.user.role === 'manager') {
      query = Project.find();
    } else {
      // kenou user 3adi, ychouf ken projets mte3ou
      query = Project.find({ proprietaire: req.user._id });
    }

    // Recherche par nom (optional)
    if (req.query.nom) {
      query = query.find({ nomProjet: { $regex: req.query.nom, $options: 'i' } });
    }

    // Filtre par statut (optional)
    if (req.query.statut) {
      query = query.find({ statut: req.query.statut });
    }

    // Tri (optional) - par défaut tji el a7dath
    const sortBy = req.query.sortBy || '-dateCreation';
    query = query.sort(sortBy);

    // npopuliw el proprietaire (njibou info ta3ou)
    query = query.populate('proprietaire', 'nom login');

    const projects = await query;

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error serveur', 
      error: error.message 
    });
  }
};

// @desc    Jib projet wa7ad
// @route   GET /api/projects/:id
// @access  Private
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('proprietaire', 'nom login');

    // n7arkou ida el projet mawjoud
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project unfound' 
      });
    }

    // n7arkou el permissions
    if (req.user.role !== 'manager' && project.proprietaire._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to view this project' 
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error serveur', 
      error: error.message 
    });
  }
};

// @desc    Modification projet
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project unfound' 
      });
    }

    // n7arkou el permissions
    if (req.user.role !== 'manager' && project.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to update this project' 
      });
    }

    // nbaddlou el projet
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('proprietaire', 'nom login');

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error serveur', 
      error: error.message 
    });
  }
};

// @desc    Suppression projet
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project unfound' 
      });
    }

    // n7arkou el permissions
    if (req.user.role !== 'manager' && project.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have permission to delete this project' 
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur', 
      error: error.message 
    });
  }
};