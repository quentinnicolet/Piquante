// Importation des modules mongoose et uniqueValidator
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Création du Schema pour stocker les données de l'utilisateur
const userSchema = mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true }
});
// Application du plugin uniqueValidator sur le Schema
userSchema.plugin(uniqueValidator);
// Exportation du modèle "User"
module.exports = mongoose.model('User', userSchema);