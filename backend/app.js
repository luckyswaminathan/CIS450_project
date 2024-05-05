const express = require('express');
const cors = require('cors');
const router = express.Router();
const { client } = require('./config/mongodbConfig');
const connection = require('./config/mysqlConfig');
const app = express();
app.use(cors());
const port = 3001;
const userRoutes = require('./routes/userRoutes');
const sentimentRoutes = require('./routes/sentimentRoutes');
const miscRoutes = require('./routes/miscRoutes');

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

app.use('/api/users', userRoutes);
app.use('/api/sentiment', sentimentRoutes);
app.use('/api', miscRoutes);

// Error handling for invalid paths
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});
