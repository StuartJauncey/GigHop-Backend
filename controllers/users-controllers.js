const { ObjectId } = require("bson");
const dbo = require("../connection");

exports.getAllUsers = (req, res) => {
  const dbConnect = dbo.getDb();
  dbConnect.collection("Users").find({}).toArray((err, result) => {
    res.json(result);
  });
};

exports.getUser = (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.user_id;
  dbConnect
    .collection("Users")
    .findOne({ _id: ObjectId(id) })
    .then(result => {
      return res.status(200).send(result);
    });
};

exports.postNewUser = async (req, res) => {
  const dbConnect = dbo.getDb();
  const newObj = req.body;
  const expectedKeys = [
    "username",
    "picture",
    "artist",
    "venue",
    "events"
  ];

  for (let i = 0; i < expectedKeys.length; i++) {
    if (!Object.keys(newObj).includes(expectedKeys[i])) {
      return res.status(400).send({
        status: 400,
        message: "Invalid Data Key"
      });
    }
  }

  await dbConnect
    .collection("Users")
    .insertOne(newObj, function(err, result) {
      if (err) {
        res.status(400).send("Error inserting new user");
      } else {
        console.log(`added a new user with if ${result.insertedId}`);
        console.log(result);
        res.status(200).send(result.insertedId);
      }
    });
};

exports.deleteUser = async (req, res) => {
  const dbConnect = dbo.getDb();
  const id = req.params.user_id;
  await dbConnect
    .collection("Users")
    .deleteOne({ _id: ObjectId(id) }, function(err, _result) {
      if (_result.deleteCount === 0) {
        res.status(400).send("no user was deleted");
      } else if (err) {
        res.status(400).send("Error deleteing user with id!");
      } else {
        console.log("User deleted");
        res.status(204).send();
      }
    });
};

exports.patchUsers = async (req, res) => {
  const dbConnect = dbo.getDb();

  const updateObject = req.body;
  const id = req.params.user_id;

  let user;

  await dbConnect
    .collection("Users")
    .findOne({ _id: ObjectId(id) })
    .then(result => {
      user = result;
    });
  if (updateObject.hasOwnProperty("add_event")) {
    for (let i = 0; i < user.events.length; i++) {
      if (
        user.events[i].event_id === updateObject.add_event.event_id
      ) {
        return res.status(400).send("event already in there");
      }
    }
    return await dbConnect.collection("Users").updateOne({
      _id: ObjectId(id)
    }, {
      $push: {
        events: updateObject.add_event
      }
    }, function(err, _result) {
      if (err) {
        res.status(400).send(`Error updating events on user`);
      } else {
        console.log("Event added to user");
        res.status(200).send(updateObject.add_event);
      }
    });
  }

  if (updateObject.hasOwnProperty("remove_event")) {
    return await dbConnect.collection("Users").findOneAndUpdate({
      _id: ObjectId(id)
    }, {
      $pull: {
        events: updateObject.remove_event
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
    !updateObject.hasOwnProperty("username") &&
    !updateObject.hasOwnProperty("picture")
  ) {
    return res.status(400).send("error no such thing to update");
  }
  await dbConnect.collection("Users").updateOne({
    _id: ObjectId(id)
  }, { $set: updateObject }, function(err, _result) {
    if (err) {
      res.status(400).send("cannot update");
    } else {
      console.log("User updated");
      res.status(200).send(req.body);
    }
  });
};
