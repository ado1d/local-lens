const Post = require('../models/post');
const Area = require('../models/area');
const Vote = require('../models/vote');
const Comment = require('../models/comment');

const ActivityLog = require('../models/activity-log');


// to show main feed by user area and optional category

exports.feed = async (req, res) => {
  const userId = req.session.userId;
  const areaId = req.session.areaId;
  if (!userId) {
    return res.redirect('/login');
  }
  const category = req.query.category || null;
  const search = req.query.search || null;
  const sort = req.query.sort || 'top';
  try {
    // Fetch posts for the feed based on current filters
    const posts = await Post.getByArea(areaId, category, search, sort);
    // Also fetch all posts (ignoring category filter) to compute counts per category
    const allPosts = await Post.getByArea(areaId, null, search, sort);
    const counts = {
      issue: allPosts.filter(p => p.category === 'issue').length,
      event: allPosts.filter(p => p.category === 'event').length,
      recommendation: allPosts.filter(p => p.category === 'recommendation').length,
      general: allPosts.filter(p => p.category === 'general').length
    };
    res.render('index', {
      posts,
      selectedCategory: category,
      searchTerm: search || '',
      counts,
      selectedSort: sort
    });
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

    await ActivityLog.logActivity(userId, 'post_created');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// display a single post's details along with its comments
exports.showPost = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    // require login to view post and comment
    return res.redirect('/login');
  }
  const postId = req.params.id;
  try {
    const post = await Post.getById(postId);
    if (!post) {
      return res.status(404).render('404');
    }
    const comments = await Comment.getByPost(postId);
    res.render('posts/show', { post, comments, currentUserId: userId, errors: req.flash('error') });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// handle posting a new comment on a post; uses logged-in user's email as the name
exports.addComment = async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  const userId = req.session.userId;
  const userEmail = req.session.email;
  // require login and email in session to comment
  if (!userId || !userEmail) {
    return res.redirect('/login');
  }
  const errors = [];
  if (!content) {
    errors.push('Comment content is required');
  }
  if (errors.length) {
    req.flash('error', errors);
    return res.redirect(`/posts/${postId}`);
  }
  try {
    await Comment.create(postId, userEmail, content);
    await ActivityLog.logActivity(userId, 'comment_added');
    res.redirect(`/posts/${postId}`);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// handle deleting a post (only the post's author can delete)
exports.deletePost = async (req, res) => {
  const userId = req.session.userId;
  const postId = req.params.id;
  if (!userId) {
    return res.redirect('/login');
  }
  try {
    const post = await Post.getById(postId);
    if (!post) {
      return res.status(404).render('404');
    }
    if (post.user_id !== userId) {
      return res.status(403).send('You are not authorized to delete this post.');
    }
    await Post.delete(postId);
    await ActivityLog.logActivity(userId, 'post_deleted');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// handle upvote
exports.upvote = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login');
  }
  const postId = req.params.id;
  try {
    await Vote.vote(userId, postId, 1);
    // redirect back to the referring page (feed or detail)
    const redirectUrl = req.get('Referer') || '/';
    await ActivityLog.logActivity(userId, 'post_upvoted');
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

// handle downvote
exports.downvote = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login');
  }
  const postId = req.params.id;
  try {
    await Vote.vote(userId, postId, -1);
    const redirectUrl = req.get('Referer') || '/';

    await ActivityLog.logActivity(userId, 'post_downvoted');
    res.redirect(redirectUrl);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.activityLog = async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.redirect('/login');
  } 
  const areaId = req.session.areaId;

  try {
    const posts = await Post.getByUserAndArea(userId, areaId);

    // await ActivityLog.logActivity(userId, 'login');

    res.render('posts/activity-log', { posts });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }

};