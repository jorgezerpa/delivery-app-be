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
    },
    listUsers: async() => {
        const result = await db.list(TABLE);
        if(!result) throw new Error('users not found');
        return result;
    },
    deleteUser: async(id) => {
        const result = await db.remove(TABLE, id);
        if(!result) throw new Error('user not found');
        return result;
    },
    updateUser: async(id, data) => {
        const result = await db.update(TABLE, id, data);
        if(!result) throw new Error('user not found');
        return result;
    },

}