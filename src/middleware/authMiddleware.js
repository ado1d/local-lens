const User = require('../models/user');



//to make currently logged in user's info available to my templates(ejs)
async function attachUser(req, res, next) {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        // preventing sending password to front end cz its no use and also can be malicious
        delete user.password;
        res.locals.currentUser = user;      // eita main goal ei func er now we can access currentUser.email /id etc from front end
      }
    } catch (err) {
      console.error(err);
    }
  }
  next();
}


// its guard middleware to protect certain routes to make sure only logged user can access
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { attachUser, requireAuth };
