const {errorType, errorName} = require('./errorsName')

const getErrorCode = (errorName) => {
    return errorType[errorName]
}

module.exports = getErrorCode