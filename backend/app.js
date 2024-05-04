const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = 3000;

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'group57.c7equauk0ncu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12klacxzl1###',
  port: '3306',
  database: 'TWEETANALYSIS'
});

const uri = "mongodb+srv://group57mongodbuser:nestledibscrunch@group57mongodb.te7y1sa.mongodb.net/?retryWrites=true&w=majority&appName=group57mongodb";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


connection.connect(err => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1); // Exit if connection fails
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/test', (req, res) => {
  connection.query('SELECT * FROM User LIMIT 10', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});


app.get('/api/user-engagement', (req, res) => {
  // Retrieve the sentiment range parameters from the query string
  const { min_sentiment, max_sentiment } = req.query;

  // Initialize the base SQL query
  let sql = `
    SELECT 
      U.USER_ID, 
      AVG(E.LIKES) AS AVG_LIKES, 
      AVG(E.RETWEET_COUNT) AS AVG_RETWEETS, 
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
      AVG_LIKES DESC, AVG_RETWEETS DESC;
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

app.get('/api/users/influence', (req, res) => {
  let minFollowers = req.query.minFollowers || 1000;
  minFollowers = parseInt(minFollowers, 10);

  if (isNaN(minFollowers)) {
    return res.status(400).json({ error: 'minFollowers parameter must be an integer' });
  }

  const sql = `
    SELECT U.USER_ID, U.USER_SCREEN_NAME, U.FOLLOWERS, U.POLITICAL_AFFILIATION, AVG(E.LIKES + E.RETWEET_COUNT) AS AVG_ENGAGEMENT
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


app.get('/api/sentiment/political-affiliation', (req, res) => {
  const sql = `
    SELECT U.POLITICAL_AFFILIATION, E.SENTIMENT, COUNT(*) AS SENTIMENT_COUNT
    FROM ELECTIONTWEETS E
    JOIN User U ON E.USER_ID = U.USER_ID
    GROUP BY U.POLITICAL_AFFILIATION, E.SENTIMENT
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

//Query 7
app.get('/api/politiciancomparison', (req, res) => {
  // SQL statement to compute average retweets per tweet for Politicians and Others
  console.log("Route /api/engagement/politiciancomparison accessed");
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


app.get('/api/topics/state-affiliation', (req, res) => {
  const limit = parseInt(req.query.limit || 10, 10);

  if (isNaN(limit)) {
    return res.status(400).json({ error: 'Limit parameter must be an integer' });
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
      E.TOPIC IS NOT NULL
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


app.get('/api/sentiment/time', async function(req, res) {
  const fromDate = req.query.from_date;
  const toDate = req.query.to_date;

  // Validate date inputs using a nullish coalescing operator for defaulting to an invalid date if not provided
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

  // Execute the query with async/await
  try {
    const [results] = await connection.promise().query(sql, [fromDate, toDate]);
    res.json(results);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/sentiment/state', (req, res) => {
  const { state, topic } = req.query;

  // Validate state code (uncomment later when state names changed to abbreviation)
 //const validStates = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',  //'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', //'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
//if (!validStates.includes(state)) {
//  return res.status(400).json({ error: 'Invalid state parameter. Please provide a valid two-letter //state code.' });
//}

  // Build SQL query dynamically based on parameters
  let sql = `
    SELECT 
      state,
      topic,
      SUM(CASE WHEN sentiment > 0 THEN 1 ELSE 0 END) AS positive_count,
      SUM(CASE WHEN sentiment = 0 THEN 1 ELSE 0 END) AS neutral_count,
      SUM(CASE WHEN sentiment < 0 THEN 1 ELSE 0 END) AS negative_count
    FROM 
      Tweets
    WHERE 
      state = ?
  `;

  const params = [state];

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
    res.json(results);
  });
});

 

app.get('/api/state-keywords', async function(req, res) {
  const limit = parseInt(req.query.limit) || 5; //maximum number of keywords/hashtags to show for each state
  const politicalAffiliation = req.query.political_affiliation; // 'Democrat' or 'Republican'
  const minimumCount = parseInt(req.query.minimum_count) || 5; // minimum number of tweets keyword must appear in state to be considered for TF-DF
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


app.get('/api/users/high-engagement', async function(req, res) {
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

  // Execute the query with async/await
  try {
    const [results] = await connection.promise().query(sql, [followersThreshold, engagementThreshold]);
    res.json(results);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//Query 7
// app.get('/api/engagement/politiciancomparison', (req, res) => {
//   // SQL statement to compute average retweets per tweet for Politicians and Others
//   const sql = `
//     SELECT
//         user_category,
//         AVG(CASE
//             WHEN user_category = 'Politician' THEN retweets_for_politicians * 1.0 / total_tweets
//             ELSE retweet_count_for_others * 1.0 / total_tweets
//         END) AS avg_retweets_per_tweet
//     FROM
//         mat_view_user_retweets
//     GROUP BY
//         user_category;
//   `;

//   connection.query(sql, (err, results) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//     res.json(results);
//   });
// });

//Query 10
app.get('/api/users/sentiment-transition', (req, res) => {
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


  // Error handling for invalid paths
// app.use((req, res) => {
//   res.status(404).json({ error: "Not Found" });
// });

