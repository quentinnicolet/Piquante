// Importer le module jsonwebtoken
const jwt = require('jsonwebtoken');
// Exporter une fonction qui prend 3 paramètres
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // Récupérer le token dans l'entête de la requête
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Vérifier le token avec le secret
        const userId = decodedToken.userId;
        // Récupérer l'ID utilisateur du token décodé
        req.auth = { userId };
        // Ajouter l'ID utilisateur à la requête
        if (req.body.userId && req.body.userId !== userId) {
            // Vérifier que l'ID utilisateur de la requête correspond à l'ID utilisateur du token
            throw 'Id utilisateur invalide !';
        } else {
            next();
        }
    } catch { res.status(401).json({ error: new Error('Requête invalide !') }); }
};