const { getAllArtists } = require("../controllers/artists-controllers");

const artistsRouter = require("express").Router();

artistsRouter.route("/").get(getAllArtists);

module.exports = artistsRouter;