const { getAllVenues } = require("../controllers/venues-controllers");

const venuesRouter = require("express").Router();

venuesRouter.route("/").get(getAllVenues);

module.exports = venuesRouter;
