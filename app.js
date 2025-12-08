import express from "express";
import path from "node:path";



import usersRouter from "./routes/usersRouter.js";

const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

app.get("/", (req, res) => {
    const newUser = req.query.newUser === "true";
    res.render("index", { newUser });
})

app.use("/users", usersRouter);

app.listen(8080);

