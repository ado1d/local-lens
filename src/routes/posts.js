const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// main feed
router.get('/', postController.feed);

// new post
router.get('/posts/new', postController.showNewPostForm);
router.post('/posts', postController.createPost);

module.exports = router;
