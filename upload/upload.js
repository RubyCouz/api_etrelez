const fs = require('fs')
const url = require('url')
const IncomingForm = require('formidable').IncomingForm // permet de porser les fichiers, express ayant du mal avec
module.exports = function upload(req, res) {

    //check de l'existence du dossier public
    const directory = './Public'
    if (!fs.existsSync(directory)) {
        // création du dossier
        fs.mkdirSync(directory)
    }
    // check de l'existence du dossier upload
    const uploadDirectory = './Public/Upload'
    if (!fs.existsSync(uploadDirectory)) {
        // création du dossier
        fs.mkdirSync(uploadDirectory)
    }
    // récupération de l'url et stockage dans un tableau
    const urlToArray = req.url.split('/')
    let folder = ''
    // check du dernier paramêtre de l'url pour savoir où le fichier sera stocké
    switch (urlToArray[2]) {
        case 'game' :
            folder = 'Game'
            break
        case 'profilePic':
            folder = 'ProfilePic'
            break
        case 'event':
            folder = 'Event'
            break
    }
    // check si le dossier de destination existe
    if (!fs.existsSync(uploadDirectory + '/' + folder)) {
        // création du dossier
        fs.mkdirSync(uploadDirectory + '/' + folder)
    }
    let form = new IncomingForm()
    form.parse(req)
        .on('fileBegin', (name, file) => {
            // check du type de fichier
            console.log(file.type)
            const acceptedType = ['image/jpeg', 'image/gif', 'image/png']
            // test du type de fichier
            if(acceptedType.includes(file.type)) {
                console.log('file accepted')
                // stockage du fichier sur le serveur
                file.path = uploadDirectory + '/' + folder + '/' + file.name
            }
        })
        // .on('file', (name, file) => {
        //     console.log('Uploaded file', name, file)
        // })
        // .on('aborted', () => {
        //     console.error('Request aborted by the user')
        // })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {
            res.json()
        })
    form.parse(req)
}