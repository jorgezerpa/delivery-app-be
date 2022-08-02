function checkRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
      if (roles.includes(user.role)) {
        next();
      } else {
        // next(throw );
        res.send('unauthorized')
        // throw new Error('unauthorized')
      }
    }
  }

  module.exports = { checkRoles }