const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodbConfig');
const connection = require('../config/mysqlConfig');

// WORKING (changed route name)
router.get('/user-engagement', (req, res) => {
    // Retrieve the sentiment range parameters from the query string
    const { min_sentiment, max_sentiment } = req.query;
  
    let sql = `
      SELECT 
        U.USER_ID, 
        AVG(E.LIKES) AS AVG_LIKES, 
        AVG(E.RETWEET_COUNT) AS AVG_RETWEET_COUNT, 
        AVG(E.SENTIMENT) AS AVG_SENTIMENT
      FROM 
        ELECTIONTWEETS E
      JOIN 
        User U ON E.USER_ID = U.USER_ID
    `;
  
    const params = [];
  
    // Validate and incorporate sentiment filters if provided
    if (min_sentiment || max_sentiment) {
      sql += ' WHERE 1=1'; // Simplifies adding additional conditions
  
      if (min_sentiment !== undefined) {
        if (!isNaN(min_sentiment) && min_sentiment >= -1 && min_sentiment <= 1) {
          sql += ' AND E.SENTIMENT >= ?';
          params.push(min_sentiment);
        } else {
          return res.status(400).json({ error: 'Invalid min_sentiment parameter. Must be a decimal between -1 and 1.' });
        }
      }
  
      if (max_sentiment !== undefined) {
        if (!isNaN(max_sentiment) && max_sentiment >= -1 && max_sentiment <= 1) {
          sql += ' AND E.SENTIMENT <= ?';
          params.push(max_sentiment);
        } else {
          return res.status(400).json({ error: 'Invalid max_sentiment parameter. Must be a decimal between -1 and 1.' });
        }
      }
    }
  
    // Complete the SQL query
    sql += `
      GROUP BY 
        U.USER_ID
      ORDER BY 
        AVG_LIKES DESC, AVG_RETWEET_COUNT DESC;
    `;
  
    // Execute the SQL query
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

// Query 9
router.get('/high-engagement', function(req, res) {
    // Reading query parameters with defaults
    const followersThreshold = parseInt(req.query.followersThreshold) || 50;
    const engagementThreshold = parseFloat(req.query.engagementThreshold) || 5;
    const compareType = req.query.compareType || 'sentiment'; // 'bias' or 'sentiment'
    const compareDirection = req.query.compareDirection || '<'; // '<' or '>'
  
    // Validate compareType and compareDirection
    if (!['sentiment', 'bias'].includes(compareType)) {
        return res.status(400).json({ error: 'Invalid compareType value. It must be "bias" or "sentiment".' });
    }
    if (!['<', '>'].includes(compareDirection)) {
        return res.status(400).json({ error: 'Invalid compareDirection value. It must be "<" or ">".' });
    }
  
    // Setup the NOT EXISTS subquery based on compareType and compareDirection
    const sentimentComparison = `ET.${compareType} ${compareDirection} 0`;
  
    const sql = `
        SELECT 
          U.user_handle, 
          U.followers, 
          U.avg_engagement
        FROM 
          User AS U
        WHERE
          NOT EXISTS (
            SELECT 1
            FROM ELECTIONTWEETS AS ET
            WHERE ET.user_id = U.user_id AND ${sentimentComparison}
          )
          AND U.followers > ?
          AND U.avg_engagement > ?
        ORDER BY 
          U.avg_engagement DESC, 
          U.followers DESC;
    `;
  
    // Execute the query with callback
    connection.query(sql, [followersThreshold, engagementThreshold], function(err, results) {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});
  
//Query 10
router.get('/sentiment-transition', (req, res) => {
    // Retrieve the follower_threshold from the query string with a default of 1000
    let followerThreshold = parseInt(req.query.followerThreshold, 10) || 1000;
  
    // Validate the follower threshold to ensure it's a positive number
    if (isNaN(followerThreshold) || followerThreshold < 0) {
      return res.status(400).json({ error: 'The follower threshold must be a positive integer.' });
    }
  
    // SQL query to find users with a significant sentiment transition and their engagement ratio changes
    const sql = `
      SELECT
          U.USER_ID,
          U.USER_HANDLE,
          MV.TRANSITION,
          MV.PRE_ENGAGEMENT_RATIO,
          MV.POST_ENGAGEMENT_RATIO,
          (MV.POST_ENGAGEMENT_RATIO - MV.PRE_ENGAGEMENT_RATIO) AS ENGAGEMENT_DIFF
      FROM
          User U
      JOIN
          materialized_view_user_sentiment_transition MV ON U.USER_ID = MV.USER_ID
      WHERE
          U.FOLLOWERS > ?
          AND MV.TRANSITION != 'No Transition'
      ORDER BY
          ENGAGEMENT_DIFF DESC;
    `;
  
    // Execute the SQL query with the follower threshold as a parameter
    connection.query(sql, [followerThreshold], (err, results) => {
      if (err) {
        console.error('SQL Error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

module.exports = router;

