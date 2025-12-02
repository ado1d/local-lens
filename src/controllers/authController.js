const User = require('../models/user');
const Area = require('../models/area');
const bcrypt = require('bcryptjs');

const ActivityLog = require('../models/activity-log');



exports.showRegister = async (req, res) => {
  try {
    const areas = await Area.getAll();
    res.render('auth/register', { areas, errors: req.flash('error'), old: {} });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


exports.register = async (req, res) => {
  const { email, password, area_id } = req.body;
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (!area_id) errors.push('Please select an area');
  if (errors.length) {
    req.flash('error', errors);
    const areas = await Area.getAll();
    return res.render('auth/register', { areas, errors: req.flash('error'), old: { email, area_id } });
  }
  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      req.flash('error', ['Email already in use']);
      const areas = await Area.getAll();
      return res.render('auth/register', { areas, errors: req.flash('error'), old: { email, area_id } });
    }
    const user = await User.create(email, password, area_id);
    req.session.userId = user.id;
    req.session.areaId = user.area_id;
    // store the user email in session so it can be used to identify commenters
    req.session.email = user.email;

    // await ActivityLog.logActivity(user.id, 'login');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};



// to render login page
exports.showLogin = (req, res) => {
  res.render('auth/login', { errors: req.flash('error'), old: {} });
};

// to handle login Post
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email) errors.push('Email is required');
  if (!password) errors.push('Password is required');
  if (errors.length) {
    req.flash('error', errors);
    return res.render('auth/login', { errors: req.flash('error'), old: { email } });
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      req.flash('error', ['Invalid email or password']);
      return res.render('auth/login', { errors: req.flash('error'), old: { email } });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash('error', ['Invalid email or password']);
      return res.render('auth/login', { errors: req.flash('error'), old: { email } });
    }
    // store session
    req.session.userId = user.id;
    req.session.areaId = user.area_id;
    // also store email to identify user when commenting
    req.session.email = user.email;

    await ActivityLog.logActivity(user.id, 'login');  
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


// to logout 
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

