const {
  getAllArtists,
  getArtist,
  postNewArtist,
  deleteArtist,
  patchArtist
} = require("../controllers/artists-controllers");

const artistsRouter = require("express").Router();

artistsRouter.route("/").get(getAllArtists);
artistsRouter.route("/:artist_id").get(getArtist);
artistsRouter.route("/").post(postNewArtist);
artistsRouter.route("/:artist_id").delete(deleteArtist);
artistsRouter.route("/:artist_id").patch(patchArtist);

module.exports = artistsRouter;