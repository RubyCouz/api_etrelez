const {errorType, errorName} = require('./errorsConstant')

const getErrorCode = errorName => {
    return errorType[errorName]
}

module.exports = getErrorCode