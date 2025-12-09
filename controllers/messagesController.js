import { body, validationResult, matchedData } from "express-validator";
import queries from "../db/queries.js";

const validateMessage = [
    body("title").trim().notEmpty().withMessage("Title must not be empty"),
    body("text").optional({ values: "falsy" }).trim(),
];

function getAddMessageForm(req, res) {
    res.render("create-message");
}

const addMessage = [
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
    res.render("home", { newMessage, messages });
}

export default {
    getAddMessageForm,
    getAllMessages,
    addMessage,
};
