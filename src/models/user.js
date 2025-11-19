const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// to interact with user table in database
const User = {
  async create(email, password, areaId) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (email, password, area_id, created_at) VALUES (?, ?, ?, NOW())',
      [email, hashed, areaId]
    );
    const id = result.insertId;
    return { id, email, area_id: areaId };
  },




  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows.length ? rows[0] : null;
  },

  

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
};

module.exports = User;
