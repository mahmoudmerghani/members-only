import { body, validationResult, matchedData } from "express-validator";
import userAuth from "./userAuth.js";
import queries from "../db/queries.js";

const JOIN_PASSWORD_HINTS = [
    ""
];

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

const getUserSignUpForm = [
    userAuth.redirectIfAuthenticated,
    (req, res) => {
        res.render("sign-up");
    },
];

const getUserLogInForm = [
    userAuth.redirectIfAuthenticated,
    (req, res) => {
        res.render("log-in");
    },
];

const addUser = [
    userAuth.redirectIfAuthenticated,
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
    userAuth.redirectIfAuthenticated,
    userAuth.authenticateUser,
    (req, res) => {
        if (req.isAuthenticated()) {
            res.redirect("/");
        } else {
            res.render("log-in", { errorMessage: req.authInfo.errorMessage });
        }
    },
];

const logOutUser = [
    userAuth.redirectIfUnauthenticated,
    (req, res, next) => {
        req.logOut((err) => {
            if (err) return next(err);

            res.redirect("/");
        });
    },
];

const getJoinForm = [
    userAuth.redirectIfUnauthenticated,
    userAuth.redirectIfMember,
    (req, res) => {
        if (!req.session.numberOfTries) {
            req.session.numberOfTries = 0;
        }

        // if numberOfTries exceeds the hints array length then get the last hint in the array
        const hint =
            JOIN_PASSWORD_HINTS[
                Math.min(
                    req.session.numberOfTries,
                    JOIN_PASSWORD_HINTS.length - 1
                )
            ];
        res.render("join-form", { hint });
    },
];

const joinUser = [
    userAuth.redirectIfUnauthenticated,
    userAuth.redirectIfMember,
    body("password")
        .equals(process.env.JOIN_SECRET)
        .withMessage("Wrong password"),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.session.numberOfTries++;
            return res.render("join-form", {
                errors: errors.array(),
                hint: getHint(req.session.numberOfTries),
            });
        }

        await queries.setUserMemberStatus(req.user.id, true);

        res.redirect("/");
    },
];

export default {
    getUserSignUpForm,
    getUserLogInForm,
    addUser,
    logInUser,
    logOutUser,
    getJoinForm,
    joinUser,
};
