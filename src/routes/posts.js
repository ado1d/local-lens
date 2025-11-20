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

// add a comment to a post
router.post('/posts/:id/comments', postController.addComment);

// delete a post (allowed only for the post author)
router.post('/posts/:id/delete', postController.deletePost);

// upvote a post
router.post('/posts/:id/upvote', postController.upvote);

// downvote a post
router.post('/posts/:id/downvote', postController.downvote);

// activity log for the current user
router.get('/activity-log', postController.activityLog);

module.exports = router;

