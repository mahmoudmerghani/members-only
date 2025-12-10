import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
import queries from "../db/queries.js";

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await queries.getUserByUsername(username);

            if (!user)
                return done(null, false, { errorMessage: "Wrong username" });

            if (!(await bcrypt.compare(password, user.password)))
                return done(null, false, { errorMessage: "Wrong password" });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await queries.getUserById(id);

        return done(null, user);
    } catch (err) {
        return done(err);
    }
});

const authenticateUser = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);

        req.authInfo = info;

        if (!user) return next();

        req.logIn(user, (err) => {
            if (err) return next(err);

            next();
        });
    })(req, res, next);
};

const redirectIfAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/");
    } else {
        next();
    }
};

const redirectIfUnauthenticated = (req, res, next) => {
    if (req.isUnauthenticated()) {
        res.redirect("/");
    } else {
        next();
    }
};

const redirectIfMember = (req, res, next) => {
    if (req.user.isMember) {
        res.redirect("/");
    } else {
        next();
    }
}

const redirectIfNotMember = (req, res, next) => {
    if (!req.user.isMember) {
        res.redirect("/");
    } else {
        next();
    }
}

export default {
    authenticateUser,
    redirectIfAuthenticated,
    redirectIfUnauthenticated,
    redirectIfMember,
    redirectIfNotMember
};
