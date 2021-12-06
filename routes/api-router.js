const venuesRouter = require("./venues-router");

// Create instance of express router
const apiRouter = require("express").Router();

apiRouter.use("/venues", venuesRouter);
apiRouter.route("/");

module.exports = apiRouter;
