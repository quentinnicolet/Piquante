// Importer le package bcrypt pour crypter le mot de passe de l'utilisateur
const bcrypt = require('bcrypt');
// Importer le package jwt pour créer un token 
const jwt = require('jsonwebtoken');
// Importer le modèle utilisateur pour le traitement des données
const User = require('../models/user');
// Importer le package validator.JS, pour valider le format du mail de l'utilisateur
const validator = require('validator');
// Exporter la fonction signup pour créer un utilisateur

exports.signup = (req, res, next) => {
    if (!validator.isEmail(req.body.email)) {
        return res.status(400).json({ error: 'Email address is not valid' });
    }
    bcrypt.hash(req.body.password, 11)
        .then(hash => {
            // Hasher le mot de passe de l'utilisateur x11
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                // Sauvegarder les données de l'utilisateur
                .then(() => res.status(201).json({ message: 'User created!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
// Exporter la fonction login pour se connecter
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de pass incorrect' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};