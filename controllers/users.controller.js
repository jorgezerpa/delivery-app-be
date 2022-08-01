const db = require('../store/mySql');
const myBcrypt = require('../utils/myBcrypt');

const TABLE = 'users';

module.exports = {
    createUser : async(user) => {
        const password = await myBcrypt.encryptPassword(user.password);
        const userInfo = {
            name:user.name,
            user_name:user.user_name,
            email: user.email
        }
        const authInfo = {
            email: user.email,
            password: password,
        }
        
        const resultUser = await db.insert(TABLE, userInfo);
        const resultAuth = await db.insert('auth', authInfo);
        return { resultUser, resultAuth };
    },
    getUser: async(id) => {
        const result = await db.get(TABLE, id);
        if(!result) throw new Error('user not found');
        return result;
    }

}