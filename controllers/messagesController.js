import { body, validationResult, matchedData } from "express-validator";
import userAuth from "./userAuth.js";
import queries from "../db/queries.js";

const validateMessage = [
    body("title").trim().notEmpty().withMessage("Title must not be empty"),
    body("text").optional({ values: "falsy" }).trim(),
];

const getAddMessageForm = [
    userAuth.redirectIfUnauthenticated,
    (req, res) => {
        res.render("create-message");
    },
];

const addMessage = [
    userAuth.redirectIfUnauthenticated,
    validateMessage,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("create-message", { errors: errors.array() });
        }

        const message = matchedData(req);
        message.userId = req.user.id;
        await queries.addMessage(message);

        res.redirect("/?newMessage=true");
    },
];

async function getAllMessages(req, res) {
    const messages = await queries.getAllMessages();
    const newMessage = req.query.newMessage === "true";
    const newUser = req.query.newUser === "true";
    res.render("index", { newUser, newMessage, messages });
}

export default {
    getAddMessageForm,
    getAllMessages,
    addMessage,
};
