const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodbConfig');
const connection = require('../config/mysqlConfig');

//Query 7
router.get('/engagement/user-type-comparison', (req, res) => {
    // SQL statement to compute average retweets per tweet for Politicians and Others
    console.log("Route /api/engagement/user-type-comparison accessed");
    const sql = `
      SELECT
          user_category,
          AVG(CASE
              WHEN user_category = 'Politician' THEN retweets_for_politicians * 1.0 / total_tweets
              ELSE retweet_count_for_others * 1.0 / total_tweets
          END) AS avg_retweets_per_tweet
      FROM
          mat_view_user_retweets
      GROUP BY
          user_category;
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
router.get('/topics/state-affiliation', (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10);
  
    if (isNaN(limit) || limit <= 0) {
      return res.status(400).json({ error: 'Limit parameter must be a positive integer' });
    }
  
    const sql = `
      SELECT 
        E.STATE, 
        U.POLITICAL_AFFILIATION, 
        E.TOPIC, 
        COUNT(*) AS TOPIC_COUNT
      FROM 
        ELECTIONTWEETS E
      JOIN 
        User U ON E.USER_ID = U.USER_ID
      WHERE 
        E.TOPIC IS NOT NULL AND E.COUNTRY = 'United States of America'
      GROUP BY 
        E.STATE, U.POLITICAL_AFFILIATION, E.TOPIC
      ORDER BY 
        TOPIC_COUNT DESC
      LIMIT ?;
    `;
  
    connection.query(sql, [limit], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

// Query 8
router.get('/state-keywords', async function(req, res) {
    const limit = parseInt(req.query.limit) || 5; //maximum number of keywords/hashtags to show for each state
    const politicalAffiliation = req.query.political_affiliation; // 'Democrat' or 'Republican'
    const minimumCount = parseInt(req.query.minimum_count) || 5; // minimum number of tweets keyword must appear in state to be considered for TF
    const field = req.query.field || 'hashtags'; // 'hashtags' or 'keywords'
  
    // Validate political affiliation
    if (politicalAffiliation && !['Democrat', 'Republican'].includes(politicalAffiliation)) {
      return res.status(400).json({ error: 'Invalid political_affiliation parameter. Choose either Democrat or Republican.' });
    }
  
    // Validate the field parameter
    if (field && !['keywords', 'hashtags'].includes(field)) {
      return res.status(400).json({ error: 'Invalid field parameter. Choose either "keywords" or "hashtags".' });
    }
  
    // Determine comparison operator based on political affiliation
    const comparisonOperator = politicalAffiliation === 'Republican' ? '$lt' : '$gt';
  
    try {
      await client.connect();
      const database = client.db("group57");
      const collection = database.collection("tweets");
  
      const pipeline = [
    { $match: {
      bias: { [comparisonOperator]: 0 },
      country: "United States of America"
    }},
    { $unwind: `$${field}` }, // Unwind by 'keywords' or 'hashtags'
    { $group: {
        _id: { keyword: `$${field}`, stateCode: "$state_code" }, // Group by keyword and state_code
        countInState: { $sum: 1 }
    }},
    { $match: { countInState: { $gte: minimumCount } } },
    { $group: {
        _id: "$_id.keyword",
        totalFrequency: { $sum: "$countInState" },
        states: {
            $push: {
                stateCode: "$_id.stateCode",
                countInState: "$countInState"
            }
        }
    }},
    { $unwind: "$states" },
    { $project: {
        keyword: "$_id",
        stateCode: "$states.stateCode",
        uniquenessScore: {
            $divide: ["$states.countInState", "$totalFrequency"]
        }
    }},
    { $sort: { stateCode: 1, uniquenessScore: -1 } },
    { $group: {
        _id: "$stateCode",
        keywords: { $push: "$keyword" }
    }},
    { $project: {
        keywords: { $slice: ["$keywords", limit] } // Limit the keywords returned per state
    }}
  ]
  
      const results = await collection.aggregate(pipeline).toArray();
      res.json(results);
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await client.close();
    }
});

// WORKING
router.get('/influence', (req, res) => {
    let minFollowers = req.query.minFollowers || 1000;
    minFollowers = parseInt(minFollowers, 10);
  
    if (isNaN(minFollowers) || minFollowers < 0) {
      return res.status(400).json({ error: 'minFollowers parameter must be a non-negative integer' });
    }
  
    const sql = `
      SELECT U.USER_ID, U.USER_HANDLE, U.FOLLOWERS, U.POLITICAL_AFFILIATION, AVG(E.LIKES + E.RETWEET_COUNT) AS AVG_ENGAGEMENT
      FROM User U
      JOIN ELECTIONTWEETS E ON U.USER_ID = E.USER_ID
      GROUP BY U.USER_ID
      HAVING U.FOLLOWERS > ?
      ORDER BY AVG_ENGAGEMENT DESC, U.FOLLOWERS DESC;
    `;
  
    connection.query(sql, [minFollowers], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
});

module.exports = router;