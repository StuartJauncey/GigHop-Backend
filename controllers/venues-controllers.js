// Helps us connect to database
const dbo = require("../connection");

exports.getAllVenues = (req, res) => {
	console.log(process.env.ATLAS_URI);
	const dbConnect = dbo.getDb();

	dbConnect
		// Specify the collection(table) we want data from
		.collection("Venues")
		// GET all the data from the collection
		.find({})
		// Changes retrieved data from request to an array for response
		.toArray((err, result) => {
			res.json(result);
		});
};
