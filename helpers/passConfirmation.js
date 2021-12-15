exports.passConfirmation = () => {
        let len = 6
        let str = ''
        while (str.length < len) {
            str += Math.random().toString(36).substr(2)
            str = str.substr(0, len)
        }
        return str
}