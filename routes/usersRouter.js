import express from "express";
import usersController from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/sign-up", usersController.getUserSignUpForm);
usersRouter.post("/sign-up", usersController.addUser);

usersRouter.get("/log-in", usersController.getUserLogInForm);
usersRouter.post("/log-in", usersController.logInUser);

usersRouter.post("/log-out", usersController.logOutUser);

usersRouter.get("/join", usersController.getJoinForm);
usersRouter.post("/join", usersController.joinUser);

export default usersRouter;
