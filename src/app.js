const express = require('express');
const session = require('express-session');

const cookieSession = require('cookie-session');

const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const { attachUser } = require('./middleware/authMiddleware');

const app = express();

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: false }));



app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 1000 // for1 day
}));


app.use(
  session({
    secret: process.env.SESSION_SECRET || 'local_area_secret',
    resave: false,
    saveUninitialized: false
  })
);

app.use(flash());

// to attach current user to locals
app.use(attachUser);



app.use(authRoutes);
app.use(postRoutes);



app.use((req, res) => {
  res.status(404).render('404');
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on ${port}`));
}