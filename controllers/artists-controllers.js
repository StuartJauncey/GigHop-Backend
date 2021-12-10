const { ObjectId } = require("bson");
const dbo = require("../connection");

exports.getAllArtists = (req, res) => {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection("Artists")
    .find({})
    .toArray()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getArtist = (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.artist_id;

  dbConnect
    .collection("Artists")
    .findOne({ _id: ObjectId(id) })
    .then(result => {
      return res.status(200).send(result);
    });
  // needs error handing for invalid ids
};

exports.postNewArtist = async (req, res) => {
  const dbConnect = dbo.getDb();
  const newArtist = req.body;
  const expectedKeys = ["artist_name", "description", "picture"];

  expectedKeys.forEach(key => {
    if (!Object.keys(newArtist).includes(key)) {
      return res.status(400).send("Invalid Artist Syntax");
    }
  });

  await dbConnect
    .collection("Artists")
    .insertOne(newArtist)
    .then(result => {
      if (result.acknowledged) {
        res.status(201).send(newArtist);
      } else {
        res.status(400).send("Something went wrong");
      }
    });
};

exports.deleteArtist = async (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.artist_id;

  await dbConnect
    .collection("Artists")
    .deleteOne({ _id: ObjectId(id) })
    .then(result => {
      if (result.deletedCount === 0) {
        res.status(400).send("No event to delete");
      } else {
        console.log("Document deleted");
        res.status(204).send();
      }
    });
};

exports.patchArtist = async (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.artist_id;
  const updatedArtist = req.body;
  let artist;

  await dbConnect
    .collection("Artists")
    .findOne({ _id: ObjectId(id) })
    .then(result => {
      artist = result;
    });
  console.log(artist);
  console.log(updatedArtist);

  if (updatedArtist.hasOwnProperty("add_event")) {
    for (let i = 0; i < artist.upcoming_events.length; i++) {
      if (
        artist.upcoming_events[i].event_id ===
        updatedArtist.add_event.event_id
      ) {
        return res.status(400).send("event already in there");
      }
    }
    return await dbConnect.collection("Artists").updateOne({
      _id: ObjectId(id)
    }, {
      $push: {
        upcoming_events: updatedArtist.add_event
      }
    }, function(err, _result) {
      if (err) {
        return res.status(400).send(`Error updating events on user`);
      } else {
        console.log("Event added to artist");
        return res.status(200).send(updatedArtist.add_event);
      }
    });
  }

  if (updatedArtist.hasOwnProperty("remove_event")) {
    return await dbConnect.collection("Artists").findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $pull: {
        upcoming_events: updatedArtist.remove_event
      }
    }, function(err, _result) {
      if (err) {
        return res.status(400).send("Error removing event");
      } else {
        return res.status(200).send();
      }
    });
  }

  if (
    updatedArtist.hasOwnProperty("artist_name") ||
    updatedArtist.hasOwnProperty("description") ||
    updatedArtist.hasOwnProperty("picture") ||
    updatedArtist.hasOwnProperty("genre")
  ) {
    await dbConnect
      .collection("Artists")
      .updateOne({ _id: ObjectId(id) }, { $set: updatedArtist })
      .then(result => {
        if (result.modifiedCount !== 0) {
          return res.status(200).send(updatedArtist);
        } else {
          return res.status(400).send("Artist not modified");
        }
      });
  } else {
    return res.status(400).send("Invalid Update Syntax");
  }
};
