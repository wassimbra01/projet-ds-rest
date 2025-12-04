const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// na3mlou schema (structure) lel utilisateur
const userSchema = new mongoose.Schema({
  // esm el utilisateur
  nom: {
    type: String,
    required: [true, 'the name of the user is required'], // lazem yakhou valeur
    trim: true // ynadhaf les espaces 
  },
  
  // login unique lkol utilisateur
  login: {
    type: String,
    required: [true, 'login is required'],
    unique: true, // kol user aandou login mte3ou wahdou 
  },
  
  // mot de passe (bech yetcrypta automatiquement)
  motDePasse: {
    type: String,
    required: [true, 'password is required'],
    minlength: [6, 'Mot de passe lazem yakhou 6 caractères 3al a9al']
  },
  
  // rôle: user wala manager
  role: {
    type: String,
    enum: ['user', 'manager'], // ken el 2 valeurs hedhom bark
    default: 'user' // par défaut kol user yabda user (moch manager)
  },
  
  // date de création (tet7at automatiquement)
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// Middleware li yetsalla9 9bal ma yetsave el user
// bech ncryptiw el mot de passe
userSchema.pre('save', async function(next) {
  // ken el mot de passe matbadlech, nkamlou bla ma ncryptiw
  if (!this.isModified('motDePasse')) {
    return next();
  }
  
  // ncryptiw el mot de passe b bcrypt (10 = salt rounds = niveau ta3 sécurité)
  const salt = await bcrypt.genSalt(10);
  this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
  next();
});

// méthode bech n7arkou ida el mot de passe shih
userSchema.methods.comparePassword = async function(motDePasseSaisi) {
  // ncompariw el mot de passe li dakhalet el user wel mot de passe el crypté fel base
  return await bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

// na3mlou el model w nexportiweh
module.exports = mongoose.model('User', userSchema);