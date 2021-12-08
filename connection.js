const { MongoClient } = require("mongodb");
const ConnectionString = process.env.ATLAS_URI;
const client = new MongoClient(ConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log(process.env.ATLAS_URI);

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
