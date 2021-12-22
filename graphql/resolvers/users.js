const User = require("../../models/user");
const bcrypt = require('bcryptjs')
const {transformUser} = require("./merge");
const {errorName} = require("../../errors/errorConstant");
const {validForm} = require("../../middleware/validForm");

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
        validForm(updateUserInput)
        try {
            const user = await User.findById(_id);
            if (!user) {
                throw new Error(errorName.ERROR_USER);
            } else {
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
        console.log(args.id)
        if(args.id === req.isAuth.userId) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        if(!req.isAuth.valid) {
            throw new Error(errorName.PERMISSION_ERROR)
        }
        const user = await User.findById({_id: args.id})
        try {
            user.remove()
            return transformUser(user)
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}
