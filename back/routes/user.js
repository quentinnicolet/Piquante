// Importer le module Express
const express = require('express');
// Créer une instance du module Express
const router = express.Router();
// Importer le contrôleur utilisateur
const userCtrl = require('../controllers/user');
// Définir les routes pour s'inscrire et se connecter
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
// Exporter le routeur pour qu'il puisse être utilisé par d'autres modules
module.exports = router;