const dbo = require("../connection");

exports.getAllArtists = (req, res) => {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection("Artists")
    .find({})
    .toArray()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
    })
}