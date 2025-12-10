import express from "express";
import session from "express-session";
import passport from "passport";
import path from "node:path";
import usersRouter from "./routes/usersRouter.js";
import messagesRouter from "./routes/messagesRouter.js";
import { config } from "dotenv";
config();



const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use(express.static(path.join(import.meta.dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/users", usersRouter);
app.use("/", messagesRouter);

app.listen(8080);

