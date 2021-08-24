const express = require('express')
const IncomingForm = require('formidable').IncomingForm // permet de porser les fichiers, express ayant du mal avec
const url = express()
module.exports = function upload(req, res) {
    let form = new IncomingForm()
    const path = url.mountpath
    console.log(path)
    form.parse(req)
        .on('fileBegin', (name, file) => {
            file.path = './public/upload/' + file.name
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