import express from "express";
import usersController from "../controllers/usersController.js";

const usersRouter = express.Router();

usersRouter.use(express.urlencoded({ extended: false }));

usersRouter.get("/sign-up", usersController.getUserSignUpForm);
usersRouter.post("/sign-up", usersController.addUser);

export default usersRouter;
