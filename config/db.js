// njibou mongoose bech nest3mlou MongoDB
const mongoose = require('mongoose');

// fonction bech tatconnecta lel database
const connectDB = async () => {
  try {
    // nconnectiw lel MongoDB bel URI li fi .env
    await mongoose.connect(process.env.MONGODB_URI);
    
    // besh nconnectiwha , na3mlou console.log
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // ken fama mochkla, na3mlou affichage lel erreur
    console.error('❌ MongoDB connection error:', error.message);
    // naw9fou el process (el application) khater mahich besh tnajem tekhdem bla base
    process.exit(1);
  }
};

// nexportiw el fonction bech nest3mlou'ha fel server.js
module.exports = connectDB;