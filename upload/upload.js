const fs = require('fs')
const url = require('url')
const IncomingForm = require('formidable').IncomingForm // permet de porser les fichiers, express ayant du mal avec
module.exports = function upload(req, res, next) {

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
    const uploadFolder = uploadDirectory + '/' + folder
    let form = new IncomingForm()
    form.multiples = false
    form.maxFileSize = 50 * 1024 * 1024 // 5 MB
    form.uploadDir = uploadFolder
    form.parse(req, async (err, fields, files) => {
        console.log('fields', fields);
        console.log('files', files);
        if (err) {
            console.log('Error parsing the file')
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
        // vérification upload multiple
        if (!files.file.length) {
            const file = files.file
            const isValid = isValidFile(file)
            // création d'un nom valide en enlevant les espaces
            const fileName = encodeURIComponent(file.name.replace(/\s/g, '-'))

            if (!isValid) {
                return res.status(400).json({
                    status: 'Fail',
                    message: 'The file is not a valid type'
                })
            }
            try {
                fs.renameSync(file.path, uploadFolder + '/' + fileName)
            } catch (error) {
                console.log(error)
            }
            try {
                const newFile = await File.create({
                    name: `files/${fileName}`
                })
                return res.status(200).json({
                    status: 'Success',
                    message: 'File created successfully !!'
                })
            } catch (error) {
                res.json({
                    error
                })
            }
        }

    })

}