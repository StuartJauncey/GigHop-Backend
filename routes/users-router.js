const {
  getAllUsers,
  getUser,
  postNewUser,
  deleteUser,
  patchUsers
} = require("../controllers/users-controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:user_id").get(getUser);
usersRouter.route("/").post(postNewUser);
usersRouter.route("/:user_id").delete(deleteUser);
usersRouter.route("/:user_id").patch(patchUsers);

module.exports = usersRouter;
