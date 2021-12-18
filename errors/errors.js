let {errorType, errorName} = require('./errorConstant')

const getErrorCode = (errorName) => {
    console.log(errorType[errorName])
    return errorType[errorName]
}

module.exports = getErrorCode