const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'group57.c7equauk0ncu.us-east-1.rds.amazonaws.com',
  user: 'admin',
  password: '12klacxzl1###',
  port: '3306',
  database: 'TWEETANALYSIS'
});

connection.connect(err => {
  if (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = connection;