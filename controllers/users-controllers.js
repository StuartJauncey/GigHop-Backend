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
  dbConnect.collection("Users").findOne({ _id: ObjectId(id) }).then(result => {
    return res.status(200).send(result);
  });
};

exports.postNewUser = async (req, res) => {
  const dbConnect = dbo.getDb();
  const newObj = req.body;
  const expectedKeys = ["username", "picture", "artist", "venue", "events"];

  for (let i = 0; i < expectedKeys.length; i++) {
    if (!Object.keys(newObj).includes(expectedKeys[i])) {
      return res.status(400).send({ status: 400, message: "Invalid Data Key" });
    }
  }

  await dbConnect.collection("Users").insertOne(newObj, function(err, result) {
    if (err) {
      res.status(400).send("Error inserting new user");
    } else {
      console.log(`added a new user with if ${result.insertedId}`);
      res.status(204).send(newObj);
    }
  });
};
