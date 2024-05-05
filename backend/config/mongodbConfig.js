const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://group57mongodbuser:nestledibscrunch@group57mongodb.te7y1sa.mongodb.net/?retryWrites=true&w=majority&appName=group57mongodb";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect(err => {
  if (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
});

module.exports = { client };