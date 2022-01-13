exports.renameFile = (oldFileName, type, id) => {
        const file = oldFileName.split('.')
        const ext = file.pop()
        return id + '_' + type + '.' + ext
}