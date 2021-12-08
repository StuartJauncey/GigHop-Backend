const { getAllArtists, getArtist, postNewArtist } = require("../controllers/artists-controllers");

const artistsRouter = require("express").Router();

artistsRouter.route("/").get(getAllArtists);
artistsRouter.route("/:artist_id").get(getArtist);
artistsRouter.route("/").post(postNewArtist);

module.exports = artistsRouter;