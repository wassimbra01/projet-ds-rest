const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fonction bech na3mlou JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Inscription utilisateur jdid
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nom, login, motDePasse, role } = req.body;

    // nchoufou est ce que el champs el lazma mawjoudin
    if (!nom || !login || !motDePasse) {
      return res.status(400).json({ 
        success: false, 
        message: 'Arj3 3abbi kol el champs el lazma' 
      });
    }

    // nchoufou est ce que el login deja mawjoud
    const userExists = await User.findOne({ login });
    if (userExists) {
      return res.status(400).json({ 
        success: false, 
        message: 'Login hedha deja mawjoud, jrab wa7ad ekher' 
      });
    }

    // na3mlou el user jdid
    const user = await User.create({
      nom,
      login,
      motDePasse,
      role: role || 'user'
    });

    // na3mlou token lel user
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User cree m3a so77a',
      data: {
        id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { login, motDePasse } = req.body;

    // nchoufou est ce que el champs mawjoudin
    if (!login || !motDePasse) {
      return res.status(400).json({ 
        success: false, 
        message: 'fill the login and the password' 
      });
    }

    // njibou el user mel database
    const user = await User.findOne({ login });

    // nchoufou est ce que el user mawjoud w el mot de passe shih
    if (!user || !(await user.comparePassword(motDePasse))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Login or password is incorrect' 
      });
    }

    // na3mlou token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connected successfully',
      data: {
        id: user._id,
        nom: user.nom,
        login: user.login,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// @desc    Jib el info ta3 el user actuel
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        id: req.user._id,
        nom: req.user.nom,
        login: req.user.login,
        role: req.user.role,
        dateCreation: req.user.dateCreation
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};