const pool = require('../config/db');

// post model to interact with database

const Post = {
  async create(userId, areaId, category, title, content) {
    await pool.query(
      'INSERT INTO posts (user_id, area_id, category, title, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, areaId, category, title, content]
    );
  },

  
  async getByArea(areaId, category = null, searchTerm = null, sort = 'newest') {
    
    let sql = `SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.area_id = ?`;
    const params = [areaId];
    if (category) {
      sql += ' AND posts.category = ?';
      params.push(category);
    }
    if (searchTerm) {
      sql += ' AND (posts.title LIKE ? OR posts.content LIKE ?)';
      const likeTerm = `%${searchTerm}%`;
      params.push(likeTerm, likeTerm);
    }
    // Determine order clause based on sort parameter
    let orderClause;
    switch (sort) {
      case 'top':
        orderClause = 'posts.upvotes DESC';
        break;
      case 'newest':
        orderClause = 'posts.created_at DESC';
        break;
      case 'last_active':
        // If we had a last_updated or last_activity column we would sort by that.
        // For now fallback to created_at desc.
        orderClause = 'posts.created_at DESC';
        break;
      default:
        orderClause = 'posts.created_at DESC';
        break;
    }
    sql += ` ORDER BY ${orderClause}`;
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  
  async getById(id) {
    const [rows] = await pool.query(
      `SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.id = ?`,
      [id]
    );
    return rows.length ? rows[0] : null;
  },

  
  async delete(id) {
    // remove comments associated with the post
    await pool.query('DELETE FROM comments WHERE post_id = ?', [id]);
    // remove votes associated with the post
    await pool.query('DELETE FROM votes WHERE post_id = ?', [id]);
    // remove the post itself
    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
  },

  async getByUserAndArea(userId, areaId) {
    const [rows] = await pool.query(
      `SELECT * FROM posts WHERE user_id = ? AND area_id = ? ORDER BY created_at DESC`,
      [userId, areaId]
    );
    return rows;
  }
};

module.exports = Post;

