const pool = require('../config/db');

// to retrive all areas
const Area = {
  async getAll() {
    const [rows] = await pool.query('SELECT * FROM areas ORDER BY name');
    return rows;
  }
};

module.exports = Area;
