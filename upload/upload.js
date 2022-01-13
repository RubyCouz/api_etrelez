const fs = require('fs')
const {errorName} = require("../errors/errorConstant");
const IncomingForm = require('formidable').IncomingForm // permet de porser les fichiers, express ayant du mal avec
const {isFolderExists} = require('../helpers/isFolderExists')
module.exports = function upload(req, res, next) {
    //check de l'existence du dossier public
    isFolderExists('./Public')
    // check de l'existence du dossier upload
    isFolderExists('./Public/Upload')
    // récupération de l'url et stockage dans un tableau
    const urlToArray = req.url.split('/')
    const id = urlToArray[4]
    const idRegex = new RegExp('^[\\w]{24}$')
    if (!idRegex.test(id)) {
        throw new Error(errorName.PERMISSION_ERROR)
    }
    let finalFolder = ''
    let userFolder = ''
    let folder = ''
    let prefix = ''
    // check du dernier paramêtre de l'url pour savoir où le fichier sera stocké
    switch (urlToArray[2]) {
        case 'game' :
            finalFolder = 'Game'
            prefix = '_game.'
            break
        case 'users':
            finalFolder = 'Users'
            prefix = '_avatar.'
            break
        case 'event':
            finalFolder = 'Event'
            prefix = '_event.'
            break
        case 'clan':
            finalFolder = 'Clan'
            prefix = '_clan.'
            break
    }
    // check si le dossier de destination existe
    isFolderExists('./Public/Upload/' + folder)
    switch(urlToArray[3]) {
        case 'banner':
            userFolder = 'Banner'
            finalFolder = finalFolder + '/' + userFolder
            prefix = '_banner.'
            break
        case 'avatar':
            userFolder = 'Avatar'
            finalFolder = finalFolder + '/' + userFolder
            prefix = '_avatar.'
            break
        default:
            userFolder = ''
            break
    }
    const uploadFolder = './Public/Upload/' + finalFolder
    isFolderExists(uploadFolder)
    let form = new IncomingForm()
    // interdiction d'upload multiple
    form.multiples = false
    // définition de la taille de fichier max autorisée, ici 5MB
    form.maxFileSize = 50 * 1024 * 1024
    // définition de l'endroit sur le serveur où sera stocké le fichier
    form.uploadDir = uploadFolder

    form.parse(req, async (err, fields, files) => {
        if (err) {

            return res.status(400).json({
                status: 'Fail',
                message: 'There was an error parsing the file',
                error: err
            })
        }
        /**
         * vérification du type de fichier
         * @param file
         * @returns {boolean}
         */
        const isValidFile = (file) => {
            const type = file.type.split('/').pop()
            const validType = ['jpg', 'jpeg', 'png', 'gif']
            return validType.indexOf(type) !== -1;

        }
        if (typeof files === 'object') {
            // vérification upload multiple
            if (!files.file.length) {
                const file = files.file
                const fileInArray = file.name.split('.')
                const ext = fileInArray.pop()
                // regex pour la vérification du nom de fichier
                const fileRegex = new RegExp('^[\\w\\s-]+\\.[A-Za-z]{3,4}$')
                // test du nom de fichier
                const regexValid = fileRegex.test(file.name)
                // vérification du type de fichier
                const isValid = isValidFile(file)
                // création d'un nom valide en enlevant les espaces
                const fileName = encodeURIComponent(file.name.replace(/\s/g, '-'))
                if (!isValid) {
                    return res.status(400).json({
                        status: 'Fail',
                        message: 'The file is not a valid type'
                    })
                }
                if (!regexValid) {
                    return res.status(400).json({
                        status: 'Fail',
                        message: 'The name of the file is not a valid name'
                    })
                }
                const finalName = id + prefix + ext
                try {
                    fs.renameSync(file.path, uploadFolder + '/' + finalName)
                    return res.status(200).json({
                        status: 'Success',
                        message: 'File created successfully !!'
                    })
                } catch (error) {
                    console.log(error)
                }

            }
        }
    })
}