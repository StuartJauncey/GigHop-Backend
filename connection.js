const { MongoClient } = require("mongodb");
const connectionString =
	"mongodb+srv://GigHop:Northcoders@cluster0.4pau2.mongodb.net/GigHop?retryWrites=true&w=majority";

const client = new MongoClient(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
	connectToServer: function (callback) {
		client.connect(function (err, db) {
			if (err || !db) {
				return callback(err);
			}
			dbConnection = db.db("GigHop");
			console.log("Connected to GigHop DB");
			return callback();
		});
	},
	getDb: function () {
		return dbConnection;
	},
};
