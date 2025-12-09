import { body, validationResult, matchedData } from "express-validator";
import queries from "../db/queries.js";

const validateMessage = [
    body("title").trim().notEmpty().withMessage("Title must not be empty"),
    body("text").optional({ values: "falsy" }).trim(),
];

const authenticate = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/");
    }
};

const getAddMessageForm = [
    authenticate,
    (req, res) => {
        res.render("create-message");
    },
];

const addMessage = [
    authenticate,
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
    if (req.isAuthenticated()) {
        const messages = await queries.getAllMessages();
        const newMessage = req.query.newMessage === "true";
        res.render("home", { newMessage, messages });
    } else {
        const newUser = req.query.newUser === "true";
        res.render("index", { newUser });
    }
}

export default {
    getAddMessageForm,
    getAllMessages,
    addMessage,
};
