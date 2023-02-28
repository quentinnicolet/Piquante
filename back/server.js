//Import du module http (Crétion du serveur) et d'app.js
const http = require('http');
const app = require('./app');
//Vérifie le port passé en paramètre. Soit un nb entier ou une chaîne de caractère
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
// Définition de la variable 'port' qui contiendra le port de l'application
const port = normalizePort(process.env.PORT || '3000');
// Configuration du port de l'application avec la variable 'port'
app.set('port', port);
// Configuration les erreurs liées au serveur
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
// Création du serveur avec la configuration de l'application
const server = http.createServer(app);
// Gestion des erreurs du serveur
server.on('error', errorHandler);
// Affichage d'un message lorsque le serveur est en écoute
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});
// Démarrage du serveur
server.listen(port);