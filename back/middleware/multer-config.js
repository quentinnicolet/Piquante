// Importe le package "multer" à partir de node_modules
const multer = require('multer');

const path = require('node:path');

// Crée un objet "MIME_TYPES" qui associe les types MIME à leur extension
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// Crée un objet "storage" qui définit le répertoire de destination et le nom des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    let name = file.originalname.split(' ').join('_');
    name = name.split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  },
});
//Single => Une image à la fois
module.exports = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg') {
      req.fileValidationError = "Forbidden extension";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  }
}).single('image');