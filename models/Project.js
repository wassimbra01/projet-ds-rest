const mongoose = require('mongoose');

// Schema lel projet
const projectSchema = new mongoose.Schema({
  // esm el projet
  nomProjet: {
    type: String,
    required: [true, ' the name of the project is required'], // lazem yakhou valeur
    trim: true
  },
  
  // description ta3 el projet
  description: {
    type: String,
    trim: true
  },
  
  // ID ta3 el user li 3amal el projet (proprietaire)
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId, // type ObjectId (ID ta3 MongoDB)
    ref: 'User', // référence lel model User
    required: true
  },
  
  // statut ta3 el projet
  statut: {
    type: String,
    enum: ['en cours', 'terminé', 'en pause'], // ken el 3 valeurs hedhom akahaw
    default: 'en cours' // par défaut yabda "en cours"
  },
  
  // date creation automatique
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// nexportiw el model
module.exports = mongoose.model('Project', projectSchema);