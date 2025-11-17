const Post = require('../models/post');
const Area = require('../models/area');



// to show main feed by user area and optional category

exports.feed = async (req, res) => {
  const userId = req.session.userId;
  const areaId = req.session.areaId;
  if (!userId) {
    return res.redirect('/login');
  }
  const category = req.query.category || null;
  try {
    const posts = await Post.getByArea(areaId, category);
    res.render('index', { posts, selectedCategory: category });  //it'll load index.ejs from //views//posts directory
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};


// to render new post form for posting
exports.showNewPostForm = (req, res) => {
  res.render('posts/new', { errors: req.flash('error'), old: {} });
};


// post submission handle
exports.createPost = async (req, res) => {
  const userId = req.session.userId;
  const areaId = req.session.areaId;
  const { category, title, content } = req.body;
  const errors = [];
  if (!category) errors.push('Category is required');
  if (!title) errors.push('Title is required');
  if (!content) errors.push('Content is required');
  if (errors.length) {
    req.flash('error', errors);
    return res.render('posts/new', { errors: req.flash('error'), old: { category, title, content } });
  }
  try {
    await Post.create(userId, areaId, category, title, content);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};
