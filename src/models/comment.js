const pool = require('../config/db');

// Comment model to handle creating and retrieving comments on posts
const Comment = {
  /**
   * Create a new comment associated with a post. The userId is optional to
   * support anonymous comments; a display name should always be provided so
   * visitors know who wrote the comment.
   *
   * @param {number} postId - ID of the post to comment on.
   * @param {string} name - Name to display alongside the comment.
   * @param {string} content - The actual comment text.
   * @returns {Promise<void>}
   */
  async create(postId, name, content) {
    await pool.query(
      'INSERT INTO comments (post_id, name, content, created_at) VALUES (?, ?, ?, NOW())',
      [postId, name, content]
    );
  },

  /**
   * Retrieve all comments for a given post ordered by oldest first. This
   * ordering encourages conversation by showing the original comments at
   * the top.
   *
   * @param {number} postId - ID of the post to fetch comments for.
   * @returns {Promise<Array>} An array of comment objects.
   */
  async getByPost(postId) {
    const [rows] = await pool.query(
      'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
      [postId]
    );
    return rows;
  }
};

module.exports = Comment;