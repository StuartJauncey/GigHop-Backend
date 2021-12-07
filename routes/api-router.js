const venuesRouter = require("./venues-router");
const eventsRouter = require("./events-router");

// Create instance of express router
const apiRouter = require("express").Router();

apiRouter.use("/venues", venuesRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.route("/");

module.exports = apiRouter;
