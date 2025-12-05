const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Fonction bech na3mlou JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @route   POST /api/auth/register
// @desc    Inscription utilisateur jdid
// @access  Public (kol wahed ynajem ya3mal compte)
router.post('/register', async (req, res) => {
  try {
    const { nom, login, motDePasse, role } = req.body;

    // n7arkou ken el champs el lazma mawjoudin
    if (!nom || !login || !motDePasse) {
      return res.status(400).json({ 
        success: false, 
        message: 'Arj3 3abbi kol el champs el lazma' 
      });
    }

    // nverifiw ken el login deja mawjoud
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
      motDePasse, // bech yetcrypta automatiquement fel model
      role: role || 'user' // ken mahatesh role, yabda user
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
});

// @route   POST /api/auth/login
// @desc    Connexion utilisateur
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { login, motDePasse } = req.body;

    // nthabtou kn el champs mawjoudin
    if (!login || !motDePasse) {
      return res.status(400).json({ 
        success: false, 
        message: 'Arj3 3abbi login w mot de passe' 
      });
    }

    // njibou el user mel database
    const user = await User.findOne({ login });

    // nthabtou ken el user mawjoud w el mot de passe shih
    if (!user || !(await user.comparePassword(motDePasse))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Login wala mot de passe ghaltin' 
      });
    }

    // na3mlou token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Connectit m3a so77a',
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
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Jib el info ta3 el user actuel
// @access  Private (lazem takoun connecté)
router.get('/me', protect, async (req, res) => {
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
      message: 'Erreur fel serveur', 
      error: error.message 
    });
  }
});

module.exports = router;
