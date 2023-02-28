//Import des modules
const express = require('express');
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//Création d'Express
const app = express();
//Import des routes, pour les sauces et les users
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
// Connexion à MongoDB
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
})
      .then(() => console.log('Connexion à MongoDB réussie !'))
      .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(
      helmet({
            crossOriginResourcePolicy: false,
      })
);
app.use(mongoSanitize());

app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
});
//Parser les données en JSON
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;