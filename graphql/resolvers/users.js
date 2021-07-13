const User = require('../../models/user')
const {transformUser} = require('./merge')

module.exports = {
    /**
     * Un utilisateur par l'id
     * @param args
     * @returns {Promise<*>}
     */
    user: async (args) => {
        try {
            const user = await User.findOne({
                _id: args._id
            })
            return transformUser(user)
        } catch (err) {
            throw err
        }
    },
    /**
     * list des utilisateur
     * @returns {Promise<*>}
     */
    users: async () => {
        try {
            const users = await User.find() // populate => récupération des infos des relations (fonctionnalité mongoose)
            return users.map(user => {
                return transformUser(user)
            })
        } catch (err) {
            throw err
        }
    }
}