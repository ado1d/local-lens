const User = require('../models/user');
const Area = require('../models/area');


async function attachUser(req, res, next) {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        delete user.password;
        let areaName = null;
        if (user.area_id) {
          try {
            const area = await Area.getById(user.area_id);
            areaName = area ? area.name : null;
          } catch (err) {
            console.error(err);
          }
        }
        res.locals.currentUser = { ...user, areaName };
      }
    } catch (err) {
      console.error(err);
    }
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

module.exports = { attachUser, requireAuth };
