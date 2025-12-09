import express from "express";
import messagesController from "../controllers/messagesController.js";

const messagesRouter = express.Router();

messagesRouter.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        const newUser = req.query.newUser === "true";
        res.render("index", { newUser });
    }
});

messagesRouter.get("/", messagesController.getAllMessages);

messagesRouter.get("/create-message", messagesController.getAddMessageForm);
messagesRouter.post("/create-message", messagesController.addMessage);

export default messagesRouter;
