const pool = require('../config/db');

// Comment model to handle creating and retrieving comments on posts
const Comment = {
  async create(postId, name, content) {
    await pool.query(
      'INSERT INTO comments (post_id, name, content, created_at) VALUES (?, ?, ?, NOW())',
      [postId, name, content]
    );
  },

  // get comments for a specific post ordered by creation time
  async getByPost(postId) {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
      [postId]
    );
    return rows;
  }
};

module.exports = Comment;