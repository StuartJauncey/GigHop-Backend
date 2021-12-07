const {
	getAllVenues,
	postNewVenue,
	patchVenueWithEvent,
	deleteEvent,
} = require("../controllers/venues-controllers");

const venuesRouter = require("express").Router();

venuesRouter.route("/").get(getAllVenues);
venuesRouter.route("/").post(postNewVenue);
venuesRouter.route("/:venue_id").patch(patchVenueWithEvent);
venuesRouter.route("/:venue_id").delete(deleteEvent);

module.exports = venuesRouter;
