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
