const {
  getAllVenues,
  postNewVenue,
  patchVenue,
  deleteVenue,
  getVenue
} = require("../controllers/venues-controllers");

const venuesRouter = require("express").Router();

venuesRouter.route("/").get(getAllVenues);
venuesRouter.route("/").post(postNewVenue);
venuesRouter.route("/:venue_id").get(getVenue);
venuesRouter.route("/:venue_id").patch(patchVenue);
venuesRouter.route("/:venue_id").delete(deleteVenue);

module.exports = venuesRouter;
