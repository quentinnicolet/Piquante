// Importation des modules nécessaires pour le fonctionnement des fonctions de l'API  
const Sauce = require('../models/sauce');
// Gère la suppression d'image d'une sauce supprimé
const fs = require('fs');
// Gère l'uathentification des utilisateurs avec les tokens
const jwt = require('jsonwebtoken');
// Création d'une sauce
exports.createSauce = (req, res, next) => {
      if (!req.file){
            res.status(400).json({ error: "This file that you provided could not be handled by multer" })
      }
      const sauceObject = JSON.parse(req.body.sauce);
      delete sauceObject._id;
      const sauce = new Sauce({
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      });
      sauce.save()
            .then(() => res.status(201).json({ message: "Objet enregistré" }))
            .catch(error => res.status(400).json({ error }));
};
// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      const sauceObject = req.file ?
            {
                  ...JSON.parse(req.body.sauce),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
      Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                  if (sauce.userId == userId) {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                              .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                              .catch(error => res.status(400).json({ error }));
                  } else {
                        res.status(401).json({ message: 'Opération non autorisée !' });
                  }
            }).catch(error => res.status(500).json({ error }));
};
// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                  if (sauce.userId == userId) {
                        const filename = sauce.imageUrl.split('/images/')[1];
                        fs.unlink(`images/${filename}`, () => {
                              Sauce.deleteOne({ _id: req.params.id })
                                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                                    .catch(error => res.status(400).json({ error }));
                        });
                  } else {
                        res.status(401).json({ message: 'Opération non autorisée !' });
                  }
            })
            .catch(error => res.status(500).json({ error }));
};
// Afficher une sauce
exports.getOneSauce = (req, res, next) => {
      Sauce.findOne({ _id: req.params.id })
            .then(sauce => res.status(200).json(sauce))
            .catch(error => res.status(404).json({ error }));
};
// Afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
      Sauce.find()
            .then(sauces => res.status(200).json(sauces))
            .catch(error => res.status(400).json({ error }));
};
// Mettre un like à une sauce
exports.like = (req, res, next) => {
      const like = req.body.like;
      if (like === 1) {
            Sauce.findOne({ _id: req.params.id })
                  .then((sauce) => {
                        if (sauce.usersDisliked.includes(req.body.userId) || sauce.usersLiked.includes(req.body.userId)) {
                              res.status(401).json({ message: 'Opération non autorisée !' });
                        } else {
                              Sauce.updateOne({ _id: req.params.id }, {
                                    $push: { usersLiked: req.body.userId },
                                    $inc: { likes: +1 },
                              })
                                    .then(() => res.status(200).json({ message: 'J\'aime !' }))
                                    .catch((error) => res.status(400).json({ error }));
                        }
                  })
                  .catch((error) => res.status(404).json({ error }));
      };
      if (like === -1) {
            Sauce.findOne({ _id: req.params.id })
                  .then((sauce) => {
                        if (sauce.usersDisliked.includes(req.body.userId) || sauce.usersLiked.includes(req.body.userId)) {
                              res.status(401).json({ message: 'Opération non autorisée !' });
                        } else {
                              Sauce.updateOne({ _id: req.params.id }, {
                                    $push: { usersDisliked: req.body.userId },
                                    $inc: { dislikes: +1 },
                              })
                                    .then(() => res.status(200).json({ message: 'Je n\'aime pas !' }))
                                    .catch((error) => res.status(400).json({ error }));
                        }
                  })
                  .catch((error) => res.status(404).json({ error }));
      };
      if (like === 0) {
            Sauce.findOne({ _id: req.params.id })
                  .then((sauce) => {
                        if (sauce.usersLiked.includes(req.body.userId)) {
                              Sauce.updateOne({ _id: req.params.id }, {
                                    $pull: { usersLiked: req.body.userId },
                                    $inc: { likes: -1 },
                              })
                                    .then(() => res.status(200).json({ message: 'J\'aime retiré !' }))
                                    .catch((error) => res.status(400).json({ error }))
                        };
                        if (sauce.usersDisliked.includes(req.body.userId)) {
                              Sauce.updateOne({ _id: req.params.id }, {
                                    $pull: { usersDisliked: req.body.userId },
                                    $inc: { dislikes: -1 },
                              })
                                    .then(() => res.status(200).json({ message: 'Je n\'aime pas retiré !' }))
                                    .catch((error) => res.status(400).json({ error }))
                        };
                  })
                  .catch((error) => res.status(404).json({ error }));
      };
};