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

exports.patchEvent = async (req, res) => {
  const dbConnect = dbo.getDb();
  const updateObject = req.body;
  const id = req.params.event_id;

  if (updateObject.hasOwnProperty("authorised")) {
    if (
      updateObject.authorised.hasOwnProperty("artist") ||
      updateObject.authorised.hasOwnProperty("venue")
    ) {
      if (
        typeof updateObject.authorised.artist === "boolean" ||
        updateObject.authorised.venue === "boolean"
      ) {
        await dbConnect.collection("Events").updateOne({
          _id: ObjectId(id)
        }, { $set: updateObject }, function(err, _result) {
          if (err) {
            res.status(400).send("Error updating events on venue with id 1!");
          } else {
            console.log("Document updated");
            res.status(200).send(req.body);
          }
        });
      }
    }
  }

  if (updateObject.hasOwnProperty("entry_price")) {
    if (updateObject.entry_price.hasOwnProperty("$numberDecimal")) {
      await dbConnect.collection("Events").updateOne({
        _id: ObjectId(id)
      }, { $set: updateObject }, function(err, _result) {
        if (err) {
          res.status(400).send("Error updating events on venue with id 1!");
        } else {
          console.log("Document updated");
          res.status(200).send(req.body);
        }
      });
    }
  }

  if (updateObject.hasOwnProperty("artists_ids")) {
    await dbConnect.collection("Events").updateOne({
      _id: ObjectId(id)
    }, { $push: updateObject }, function(err, _result) {
      // UPDATE OBJECT IN REQUEST: { "upcoming_events": "<event_id>" }
      if (err) {
        res.status(400).send(`Error updating artists on events with id 1!`);
      } else {
        console.log("Document updated");
        res.status(200).send(req.body);
      }
    });
  }

  if (
    !updateObject.hasOwnProperty("venue_id") &&
    !updateObject.hasOwnProperty("description") &&
    !updateObject.hasOwnProperty("picture") &&
    !updateObject.hasOwnProperty("user_id") &&
    !updateObject.hasOwnProperty("time_end") &&
    !updateObject.hasOwnProperty("time_start") &&
    !updateObject.hasOwnProperty("event_name")
  ) {
    return res.status(400).send(`Error updating events on venue with id 3!`);
  }
  await dbConnect.collection("Venues").updateOne({
    _id: ObjectId(id)
  }, { $set: updateObject }, function(err, _result) {
    if (err) {
      res.status(400).send(`Error updating events on venue with id 2!`);
    } else {
      console.log("Document updated");
      res.status(200).send(req.body);
    }
  });
};

// exports.patchVenue = async (req, res) => {
//     const dbConnect = dbo.getDb();

//     const updateObject = req.body;
//     const id = req.params.venue_id;
//     if (updateObject.hasOwnProperty("upcoming_events")) {
//       await dbConnect.collection("Venues").updateOne({
//         _id: ObjectId(id)
//       }, { $push: updateObject }, function(err, _result) {
//         // UPDATE OBJECT IN REQUEST: { "upcoming_events": "<event_id>" }
//         if (err) {
//           res.status(400).send(`Error updating events on venue with id 1!`);
//         } else {
//           console.log("Document updated");
//           res.status(200).send(req.body);
//         }
//       });
//     }

//     if (
//       !updateObject.hasOwnProperty("venue_name") &&
//       !updateObject.hasOwnProperty("description") &&
//       !updateObject.hasOwnProperty("picture") &&
//       !updateObject.hasOwnProperty("address")
//     ) {
//       return res.status(400).send(`Error updating events on venue with id 3!`);
//     }
//     await dbConnect.collection("Venues").updateOne({
//       _id: ObjectId(id)
//     }, { $set: updateObject }, function(err, _result) {
//       if (err) {
//         res.status(400).send(`Error updating events on venue with id 2!`);
//       } else {
//         console.log("Document updated");
//         res.status(200).send(req.body);
//       }
//     });
//   };
