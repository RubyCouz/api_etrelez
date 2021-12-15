const {errorType, errorName} = require('./errorsToken')

const getErrorCode = errorName => {
    return errorType[errorName]
}

module.exports = getErrorCode