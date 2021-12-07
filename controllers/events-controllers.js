const { ObjectId } = require("bson");
const dbo = require("../connection");

exports.getAllEvents = (req, res) => {
  const dbConnect = dbo.getDb();
  dbConnect.collection("Events").find({}).toArray((err, result) => {
    res.json(result);
  });
};

exports.getEvent = (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.event_id;
  dbConnect.collection("Events").findOne({ _id: ObjectId(id) }).then(result => {
    res.status(200).send(result);
  });
};

exports.postNewEvent = async (req, res) => {
  const dbConnect = dbo.getDb();
  const newObj = req.body;
  const expectedKeys = [
    "event_name",
    "entry_price",
    "description",
    "venue_id",
    "user_id",
    "artists_ids",
    "authorised",
    "time_end",
    "time_start",
    "picture"
  ];

  for (let i = 0; i < expectedKeys.length; i++) {
    if (!Object.keys(newObj).includes(expectedKeys[i])) {
      return res.status(400).send({ status: 400, message: "Invalid Data Key" });
    }
  }

  await dbConnect.collection("Events").insertOne(newObj, function(err, result) {
    if (err) {
      res.status(400).send("Error inserting matches!");
    } else {
      console.log(`Added a new match with id ${result.insertedId}`);
      res.status(204).send(newObj);
    }
  });
};

exports.deleteEvent = async (req, res) => {
  const dbConnect = dbo.getDb();

  const id = req.params.event_id;

  await dbConnect
    .collection("Events")
    .deleteOne({ _id: ObjectId(id) }, function(err, _result) {
      if (_result.deletedCount === 0) {
        res.status(400).send("No event to delete");
      } else if (err) {
        res.status(400).send(`Error deleting event with id!`);
      } else {
        console.log("Document deleted");
        res.status(204).send();
      }
    });
};
