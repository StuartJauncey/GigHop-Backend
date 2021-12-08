const venuesRouter = require("./venues-router");
const eventsRouter = require("./events-router");
const usersRouter = require("./users-router");
const artistsRouter = require("./artists-router");

// Create instance of express router
const apiRouter = require("express").Router();

apiRouter.use("/venues", venuesRouter);
apiRouter.use("/events", eventsRouter);
apiRouter.use("/artists", artistsRouter);
apiRouter.route("/");
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
