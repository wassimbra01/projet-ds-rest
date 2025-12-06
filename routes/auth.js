
const express = require('express');
const router = express.Router();
// const { protect } = require('../middleware/auth');  // ← Commente ça
const { register, login, getMe } = require('../controllers/authController');

// Route d'inscription - Public
router.post('/register', register);

// Route de connexion - Public
router.post('/login', login);

// Route bes njibou les info user actuel - Private (lazem token)
router.get('/me', getMe);  //  Sans protection temporairement

module.exports = router;
