const fs = require("fs");
exports.isFolderExists = (directory) => {
    // si le dossier n'existe pas
    if (!fs.existsSync(directory)) {
        // création du dossier
        fs.mkdirSync(directory)
    }
}