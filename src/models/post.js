const pool = require('../config/db');

// post model to interact with database

const Post = {
  async create(userId, areaId, category, title, content) {
    await pool.query(
      'INSERT INTO posts (user_id, area_id, category, title, content, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, areaId, category, title, content]
    );
  },

  async getByArea(areaId, category = null) {
    let sql = `SELECT posts.*, users.email FROM posts JOIN users ON posts.user_id = users.id WHERE posts.area_id = ?`;
    const params = [areaId];
    if (category) {
      sql += ' AND posts.category = ?';
      params.push(category);
    }
    sql += ' ORDER BY posts.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return rows;
  }
};

module.exports = Post;
