const pool = require('../config/db');

// ActivityLog model to handle logging user activities 
const ActivityLog = {
  async logActivity(userId, activityType) {
    
    
    await pool.query(
      'INSERT INTO activity_log (user_id, activity_type, created_at) VALUES (?, ?, NOW())',
      [userId, activityType]
    );
  }
};

module.exports = ActivityLog;