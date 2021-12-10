const { MongoClient } = require("mongodb");
// Connect to Heroku
const ConnectionString = process.env.MONGODB_URI;
const client = new MongoClient(ConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let dbConnection;

module.exports = {
  connectToServer: function(callback) {
    client.connect(function(err, db) {
      if (err || !db) {
        return callback(err);
      }
      dbConnection = db.db("GigHop");
      console.log("Connected to GigHop DB");
      return callback();
    });
  },
  getDb: function() {
    return dbConnection;
  }
};
