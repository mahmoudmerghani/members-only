import express from "express";
import session from "express-session";
import passport from "passport";
import path from "node:path";
import usersRouter from "./routes/usersRouter.js";
import { config } from "dotenv";
config();




const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("home");
    } else {
        const newUser = req.query.newUser === "true";
        res.render("index", { newUser });
    }
})

app.use("/users", usersRouter);

app.listen(8080);

