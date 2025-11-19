const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// main feed
router.get('/', postController.feed);

// new post
router.get('/posts/new', postController.showNewPostForm);
router.post('/posts', postController.createPost);

// view a specific post
router.get('/posts/:id', postController.showPost);

// upvote a post
router.post('/posts/:id/upvote', postController.upvote);

// downvote a post
router.post('/posts/:id/downvote', postController.downvote);

module.exports = router;
