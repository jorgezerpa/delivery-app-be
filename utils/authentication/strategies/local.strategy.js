const { Strategy } = require('passport-local');
const myBcrypt = require('../../myBcrypt');
const db = require('../../../store/mySql');

const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      let user = await db.getUserByEmail('auth', email); 
      if (!user) {
        done(new Error('unauthorized'), false);
      }
      const isMatch = await myBcrypt.verifyPassword(password, user.password);
      if (!isMatch) {
        done(new Error('unauthorized'), false);
      } 
      user = await db.get('users', user.id);
      done(null, user);
    } catch (e) {
      done(e, false);
    }
  }
);

module.exports = LocalStrategy;