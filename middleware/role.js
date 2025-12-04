// Middleware bech nverifiw el role ta3 el user
// ...roles = na9blou ay 3add men roles (user, manager, etc)
const authorize = (...roles) => {
  return (req, res, next) => {
    // nverifiw kn  el user mawjoud fel request (yethat fel protect middleware 9bal)
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Moch authentifié' 
      });
    }

    // nthabtou ken el role ta3 el user mawjoud fel liste ta3 roles el autorisés
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} maandouch el permission lel action hedhi. Lazem takoun ${roles.join(' wala ')}` 
      });
    }

    // kn kol chay mrigel, nkamlou
    next();
  };
};

// nexportiw el middleware
module.exports = { authorize };