// njibou kol el modules el lazmin
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// n7jibou el fichier .env bech nest3mlou el variables
dotenv.config();

// nconnectiw lel MongoDB
connectDB();

// na3mlou instance men express
const app = express();

// Middlewares globaux (yet7atou 9bal kol chay)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de test (bech nverifiw est ce que el serveur kheddem)
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API worked succesfully ' 
  });
});

// njibou el routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

// ntesttiw el routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Error handler - ken fama ay route maahich mawjouda
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route unfound' 
  });
});

// njibou el port men .env wala nest3mlou 5000 par défaut
const PORT = process.env.PORT || 5000;

// nlaunchiw el serveur
app.listen(PORT, () => {
  console.log(` Serveur runs succefully ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
});