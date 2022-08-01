const bcrypt = require('bcrypt');

const encryptPassword = async(password) => {
    try {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    } catch (e) {
        console.log('bcrypt error', e)
    }
}

const verifyPassword = async(password, hash) => {
    const isMatch = await bcrypt.compare(password,hash)
    return isMatch;
}

module.exports = {
    encryptPassword,
    verifyPassword,
}