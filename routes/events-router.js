const {
  getAllEvents,
  getEvent,
  postNewEvent,
  deleteEvent
} = require("../controllers/events-controllers");

const eventsRouter = require("express").Router();

eventsRouter.route("/").get(getAllEvents);
eventsRouter.route("/:event_id").get(getEvent);
eventsRouter.route("/").post(postNewEvent);
eventsRouter.route("/:event_id").delete(deleteEvent);

module.exports = eventsRouter;
