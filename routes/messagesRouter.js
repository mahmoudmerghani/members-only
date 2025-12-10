import express from "express";
import messagesController from "../controllers/messagesController.js";

const messagesRouter = express.Router();

messagesRouter.get("/", messagesController.getAllMessages);

messagesRouter.get("/create-message", messagesController.getAddMessageForm);
messagesRouter.post("/create-message", messagesController.addMessage);

messagesRouter.post("/:messageId/delete", messagesController.deleteMessage);

export default messagesRouter;
