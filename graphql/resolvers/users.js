const User = require('../../models/user')
const {transformUser} = require('./merge')
const {errorName} = require('../../errors/errorConstant')
const {validForm} = require('../../middleware/validForm')
const {renameFile} = require('../../helpers/renameFile')

module.exports = {
    /**
     * Un utilisateur par l'id
     * @param args
     * @returns {Promise<*>}
     */
    user: async (args) => {
        try {
            const user = await User.findOne({
                _id: args._id,
            });
            return transformUser(user);
        } catch (err) {
            throw err;
        }
    },
    /**
     * list des utilisateur
     * @returns {Promise<*>}
     */
    users: async () => {
        try {
            const users = await User.find(); // populate => récupération des infos des relations (fonctionnalité mongoose)
            return users.map((user) => {
                return transformUser(user);
            });
        } catch (err) {
            throw err;
        }
    },
    /**
     * update user's informations
     * @param _id
     * @param updateUserInput
     * @param req
     * @returns {Promise<*&{createdAt: string, user_createdEvent: *, user_stream: *, _id: *, user_game_played: *, user_clan: *, updatedAt: string}>}
     */
    updateUser: async ({_id: _id, updateUserInput}, req) => {
        if (!req.isAuth.valid && !(req.isAuth.userRole === "admin" || req.isAuth.userId === _id)) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        if (updateUserInput.user_email === '') {
            throw new Error(errorName.ERROR_EMPTY_MAIL)
        }
        if (updateUserInput.user_login === '') {
            throw new Error(errorName.ERROR_EMPTY_LOGIN)
        }
        if (updateUserInput.user_password === '') {
            throw new Error(errorName.ERROR_EMPTY_PASSWORD)
        }
        validForm(updateUserInput)
        try {
            const user = await User.findById(_id)
            console.log(user)
            if (!user) {
                throw new Error(errorName.ERROR_USER);
            } else {
                if(updateUserInput.user_avatar !== '' && updateUserInput.user_avatar !== undefined) {
                    updateUserInput.user_avatar = renameFile(updateUserInput.user_avatar, 'avatar', _id)
                }
                if(updateUserInput.user_banner !== '' && updateUserInput.user_banner !== undefined) {
                    updateUserInput.user_banner = renameFile(updateUserInput.user_banner, 'banner', _id)
                }
                User.findOneAndUpdate(
                    {_id: _id},
                    updateUserInput,
                    function (err, doc) {
                        if (err) return res.send(500, {error: err});
                    }
                );
            }
            return transformUser(user);
        } catch (error) {
            throw error;
        }
    },
    /**
     * suppression d'un user
     * @param args
     * @param req
     * @returns {Promise<*&{createdAt: string, user_createdEvent: *, user_stream: *, _id: *, user_game_played: *, user_clan: *, updatedAt: string}>}
     */
    deleteUser: async (args, req) => {
        if (args.id === req.isAuth.userId) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        if (!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        const user = await User.findById({_id: args.id})
        try {
            user.remove()
            return transformUser(user)
        } catch (err) {
            throw err
        }
    }
}
