const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// na3mlou schema (structure) lel utilisateur
const userSchema = new mongoose.Schema({
  // esm el utilisateur
  nom: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  
  // login unique lkol utilisateur
  login: {
    type: String,
    required: [true, 'Login is required'],
    unique: true,
    trim: true
  },
  
  // mot de passe (bech yetcrypta automatiquement)
  motDePasse: {
    type: String,
    required: [true, 'Mot de passe is required'],
    minlength: [6, 'Mot de passe must have atleast 6 caracters']
  },
  
  // rôle: user wala manager
  role: {
    type: String,
    enum: ['user', 'manager'],
    default: 'user'
  },
  
  // date de création (tet7at automatiquement)
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// Middleware li yestaamlou 9bal ma yetsave el user - bech ncryptiw el mot de passe
// Mongoose 6+: ma nest3mllouch next() m3a async/await!
userSchema.pre('save', async function() {
  // ken el mot de passe matbadlech, nkamlou bla ma ncryptiw
  if (!this.isModified('motDePasse')) return;
  
  // ncryptiw el mot de passe b bcrypt (10 = salt rounds = niveau ta3 sécurité)
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
});

// méthode bech nthabtou est ce que el mot de passe shih wale
userSchema.methods.comparePassword = async function(motDePasseSaisi) {
  // ncompariw el mot de passe li dakhalet el user mel mot de passe el crypté fel database
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

// na3mlou el model w nexportiweh
module.exports = mongoose.model('User', userSchema);