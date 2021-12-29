let {errorType, errorName} = require('./errorConstant')

const getErrorCode = (errorName) => {
    return errorType[errorName]
}

module.exports = getErrorCode