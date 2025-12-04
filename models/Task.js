const mongoose = require('mongoose');

// Schema lel tâche
const taskSchema = new mongoose.Schema({
  // titre ta3 el tâche
  titre: {
    type: String,
    required: [true, 'tache 1'],
    trim: true
  },
  
  // description ta3 el tâche
  description: {
    type: String,
    trim: true
  },
  
  // statut ta3 el tâche (todo, doing, wala done)
  statut: {
    type: String,
    enum: ['todo', 'doing', 'done'], // ken el 3 valeurs akahaw(comme demandé fel enoncé)
    default: 'todo' // par défaut tabda "todo"
  },
  
  // deadline ta3 el tâche (date limite)
  deadline: {
    type: Date
  },
  
  // ID ta3 el projet li temchi 3lih el tâche hedhi
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project', // référence lel model Project
    required: true
  },
  
  // ID ta3 el user li tfarak bih el tâche w inajem ikoun mafamesh 
  utilisateurAssigne: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // référence lel model User
  },
  
  // date creation automatique
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

// nexportiw el model
module.exports = mongoose.model('Task', taskSchema);