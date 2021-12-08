const {
  getAllUsers,
  getUser,
  postNewUser
} = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:user_id").get(getUser);
usersRouter.route("/").post(postNewUser);

module.exports = usersRouter;
