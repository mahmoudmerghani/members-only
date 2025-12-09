import { body, validationResult, matchedData } from "express-validator";
import authenticateUser from "./authenticateUser.js";
import queries from "../db/queries.js";

const validateUser = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name must not be empty"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name must not be empty"),
    body("username")
        .trim()
        .notEmpty()
        .withMessage("username must not be empty")
        .custom(async (value) => {
            const user = await queries.getUserByUsername(value);

            if (user) {
                throw new Error("A user already exists with the same username");
            }
        }),
    body("password").notEmpty().withMessage("Password must not be empty"),
    body("passwordConfirm").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password don't match");
        }
        return true;
    }),
];

function getUserSignUpForm(req, res) {
    res.render("sign-up");
}

function getUserLogInForm(req, res) {
    res.render("log-in");
}

const addUser = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("sign-up", { errors: errors.array() });
        }

        await queries.addUser(matchedData(req));
        res.redirect("/?newUser=true");
    },
];

const logInUser = [
    authenticateUser,
    (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.render("log-in", { errorMessage: req.authInfo.errorMessage });
        }
    },
];

function logOutUser(req, res, next) {
    req.logOut((err) => {
        if (err) return next(err);

        res.redirect("/");
    });
}

export default {
    getUserSignUpForm,
    getUserLogInForm,
    addUser,
    logInUser,
    logOutUser,
};
