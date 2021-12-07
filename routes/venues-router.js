const {
	getAllVenues,
	postNewVenue,
	patchVenueWithEvent,
} = require("../controllers/venues-controllers");

const venuesRouter = require("express").Router();

venuesRouter.route("/").get(getAllVenues);
venuesRouter.route("/").post(postNewVenue);
venuesRouter.route("/:venue_id").patch(patchVenueWithEvent);

module.exports = venuesRouter;
