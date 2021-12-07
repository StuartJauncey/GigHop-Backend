// Helps us connect to database
const { ObjectId } = require("bson");
const dbo = require("../connection");

exports.getAllVenues = (req, res) => {
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

exports.getVenue = (req, res) => {
	const dbConnect = dbo.getDb();

	const id = req.params.venue_id;

	dbConnect
		// Specify the collection(table) we want data from
		.collection("Venues")
		// GET specific data from the collection
		.findOne({ _id: ObjectId(id) })
		.then((result) => {
			res.status(200).send(result);
		});
};

exports.postNewVenue = async (req, res) => {
	const dbConnect = dbo.getDb();
	const newObj = req.body;
	const expectedKeys = [
		"venue_name",
		"coordinates",
		"description",
		"picture",
		"address",
		"upcoming_events",
	];

	for (let i = 0; i < expectedKeys.length; i++) {
		if (!Object.keys(newObj).includes(expectedKeys[i])) {
			return res.status(400).send({ status: 400, message: "Invalid Data Key" });
		}
	}

	await dbConnect
		.collection("Venues")
		.insertOne(newObj, function (err, result) {
			if (err) {
				res.status(400).send("Error inserting matches!");
			} else {
				console.log(`Added a new match with id ${result.insertedId}`);
				res.status(204).send(newObj);
			}
		});
};

exports.patchVenue = async (req, res) => {
	const dbConnect = dbo.getDb();

	const updateObject = req.body;
	const id = req.params.venue_id;
	if (updateObject.hasOwnProperty("upcoming_events")) {
		await dbConnect.collection("Venues").updateOne(
			{
				_id: ObjectId(id),
			},
			{ $push: updateObject },
			function (err, _result) {
				// UPDATE OBJECT IN REQUEST: { "upcoming_events": "<event_id>" }
				if (err) {
					res.status(400).send(`Error updating events on venue with id 1!`);
				} else {
					console.log("Document updated");
					res.status(200).send(req.body);
				}
			}
		);
	}

	if (
		!updateObject.hasOwnProperty("venue_name") &&
		!updateObject.hasOwnProperty("description") &&
		!updateObject.hasOwnProperty("picture") &&
		!updateObject.hasOwnProperty("address")
	) {
		return res.status(400).send(`Error updating events on venue with id 3!`);
	}
	await dbConnect.collection("Venues").updateOne(
		{
			_id: ObjectId(id),
		},
		{ $set: updateObject },
		function (err, _result) {
			if (err) {
				res.status(400).send(`Error updating events on venue with id 2!`);
			} else {
				console.log("Document updated");
				res.status(200).send(req.body);
			}
		}
	);
};

exports.deleteVenue = async (req, res) => {
	const dbConnect = dbo.getDb();

	const id = req.params.venue_id;

	await dbConnect
		.collection("Venues")
		.deleteOne({ _id: ObjectId(id) }, function (err, _result) {
			if (_result.deletedCount === 0) {
				res.status(400).send("No venue to delete");
			} else if (err) {
				res.status(400).send(`Error deleting venue with id!`);
			} else {
				console.log("Document deleted");
				res.status(204).send();
			}
		});
};
