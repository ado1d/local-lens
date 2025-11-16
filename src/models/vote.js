const pool = require('../config/db');


// vote model to handle upvote n downvote
const Vote = {
  // register a vote, if user already voted update it       (voteType 1 for up -1 for for downvote)
  async vote(userId, postId, voteType) {
    const [rows] = await pool.query('SELECT * FROM votes WHERE user_id = ? AND post_id = ?', [userId, postId]);
    if (rows.length) {
      await pool.query('UPDATE votes SET vote_type = ? WHERE id = ?', [voteType, rows[0].id]);
    } else {
      await pool.query('INSERT INTO votes (user_id, post_id, vote_type) VALUES (?, ?, ?)', [userId, postId, voteType]);
    }
    // update post's upvote count
    const [sumRows] = await pool.query('SELECT SUM(vote_type) as score FROM votes WHERE post_id = ?', [postId]);
    const score = sumRows[0].score || 0;
    await pool.query('UPDATE posts SET upvotes = ? WHERE id = ?', [score, postId]);
  }
};

module.exports = Vote;
