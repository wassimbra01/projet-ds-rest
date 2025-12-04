const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bech n7arkou idha el user authentifié (3andou token shih)
const protect = async (req, res, next) => {
  let token;

  // n7arkou ken el token mawjoud fel headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // njibou el token men el header (format: "Bearer TOKEN_ICI")
      token = req.headers.authorization.split(' ')[1];

      // nverifiw el token w njibou el données li fih (user ID)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // njibou el user men el database w n7attou fel request
      req.user = await User.findById(decoded.id).select('-motDePasse');

      // ken kol chay mriel, nkamlou lel route (next)
      next();
    } catch (error) {
      // ken el token ghalat wala expired
      console.error('Token verification error:', error);
      return res.status(401).json({ 
        success: false, 
        message: 'Token ghalat wala expired, arj3 lawej' 
      });
    }
  }

  // ken e token mafamesh men aslou
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Mafelemch token, lazem ta3mel login' 
    });
  }
};

// nexportiw el middleware
module.exports = { protect };