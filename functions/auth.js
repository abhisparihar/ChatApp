const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const saltedSha512 = require('salted-sha512');

const userModel = require("../models/user");

module.exports = {
    passport: function (app) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(
            new LocalStrategy(
                {
                    usernameField: "email",
                    passwordField: "password",
                },
                async function (email, password, done) {
                    const user = await userModel.findOne({
                        email: email.trim().toLowerCase(),
                        password: saltedSha512(password, process.env.SHA512_SALT_KEY),
                        isDeleted: false
                    }, { __v: 0, updatedAt: 0, isDeleted: 0, }).lean();
                    return done(null, user);
                },
            )
        );

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(async function (user, done) {
            done(null, user);
        });
    },
    checkAuth: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/')
    }
}