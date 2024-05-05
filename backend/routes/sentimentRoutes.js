const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodbConfig');
const connection = require('../config/mysqlConfig');

// WORKING
router.get('/political-affiliation', (req, res) => {
    const sql = `
      SELECT 
        U.POLITICAL_AFFILIATION, 
        CASE 
          WHEN E.SENTIMENT > 0 THEN 'Positive'
          WHEN E.SENTIMENT < 0 THEN 'Negative'
          ELSE 'Neutral'
        END AS SENTIMENT_CATEGORY,
        COUNT(*) AS SENTIMENT_COUNT
      FROM ELECTIONTWEETS E
      JOIN User U ON E.USER_ID = U.USER_ID
      GROUP BY U.POLITICAL_AFFILIATION, SENTIMENT_CATEGORY
      ORDER BY U.POLITICAL_AFFILIATION, SENTIMENT_COUNT DESC;
    `;
  
    connection.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

// WORKING
router.get('/time', function(req, res) {
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;
  
    // Validate date inputs
    if (!fromDate || !toDate || isNaN(new Date(fromDate).getTime()) || isNaN(new Date(toDate).getTime())) {
      return res.status(400).json({ error: 'Invalid date parameters. Please use valid from_date and to_date parameters.' });
    }
  
    const sql = `
      SELECT 
        E.TOPIC, 
        MONTH(E.CREATED_AT) AS TWEET_MONTH, 
        E.SENTIMENT, 
        COUNT(*) AS SENTIMENT_COUNT
      FROM 
        ELECTIONTWEETS E
      WHERE 
        E.TOPIC IS NOT NULL AND E.CREATED_AT BETWEEN ? AND ?
      GROUP BY 
        E.TOPIC, MONTH(E.CREATED_AT), E.SENTIMENT
      ORDER BY 
        E.TOPIC, TWEET_MONTH;
    `;
  
    // Execute the query using the callback method
    connection.query(sql, [fromDate, toDate], (err, results, fields) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

// WORKING
router.get('/state', (req, res) => {
    const { state_code, topic } = req.query;
  
    // Validate state code
   const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA','KS', 'KY', 'LA', 
   'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 
   'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
   if (!validStates.includes(state_code)) {
    return res.status(400).json({ error: 'Invalid state parameter. Please provide a valid two-letter state code.' });
    }
  
    // Build SQL query dynamically based on parameters
    let sql = `
      SELECT 
        state,
        topic,
        SUM(CASE WHEN sentiment > 0 THEN 1 ELSE 0 END) AS positive_count,
        SUM(CASE WHEN sentiment = 0 THEN 1 ELSE 0 END) AS neutral_count,
        SUM(CASE WHEN sentiment < 0 THEN 1 ELSE 0 END) AS negative_count
      FROM 
        ELECTIONTWEETS
      WHERE 
        state_code = ?
    `;
  
    const params = [state_code];
  
    if (topic) {
      sql += ' AND topic = ?';
      params.push(topic);
    }
  
    sql += ' GROUP BY topic';
  
    connection.query(sql, params, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No data found for the specified topic' });
      }
      res.json(results);
    });
});
  
module.exports = router;