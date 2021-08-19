const User = require("../../models/user");
const bcrypt = require('bcryptjs')
const { transformUser } = require("./merge");

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
  updateUser: async ({ _id: _id, updateUserInput }, req) => {
    if(!req.isAuth.valid && !(req.isAuth.userRole === "admin" || req.isAuth.userId === _id))  {
      throw new Error('Non !')
    }

    try {
      const user = await User.findById(_id);
      if (!user) {
        throw new Error("id inconnu");
      } else {
        User.findOneAndUpdate(
          { _id: _id },
          updateUserInput,
          function (err, doc) {
            if (err) return res.send(500, { error: err });
          }
        );
      }
      return transformUser(user);
    } catch (error) {
      throw error;
    }
  },
};
