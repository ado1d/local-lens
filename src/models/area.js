const pool = require('../config/db');

// to retrive all areas
const Area = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM areas ORDER BY name');
    return rows;
  },

  
  async getById(id) {
    const [rows] = await pool.query('SELECT * FROM areas WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }
};

module.exports = Area;

