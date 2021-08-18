const IncomingForm = require('formidable').IncomingForm // permet de porser les fichiers, express ayant du mal avec
module.exports = function upload(req, res) {
    let form = new IncomingForm()
    form.on('file', (field, file) => {
        console.log(field)
        console.log(file)
        // sauvegarde du fichier en bdd
        // envoie du fichier sur le serveur
    })
    form.on('end', () => {
        res.json()
    })
    form.parse(req)
}