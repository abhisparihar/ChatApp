const authLog = fileLogger("auth");
const passport = require('passport');
const saltedSha512 = require('salted-sha512');
const { responseMessages } = require('../constant');
const userModel = require('../models/user');

const getLogin = async (req, res, next) => {
    try {
        res.render('pages/users/login', {
            layout: 'login',
            title: 'Login'
        })
    } catch (error) {
        authLog.error(error)
        console.log("🚀 ~ login ~ error:", error)
    }
}

const postLogin = async function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            return res.sendError();
        }
        //if user not found
        if (!user) {
            return res.status(400).json({ error: responseMessages['invalidUser'] });
        }
        //log in user
        req.logIn(user, async function (err) {
            if (err) {
                return res.status(400).json({ error: responseMessages['invalidUser'] });
            };
            return res.status(200).json({ success: responseMessages['login'], role: user.role, _id: user._id });
        });
    })(req, res, next);
}

const logout = async function (req, res, next) {
    req.logout();
    req.flash("success", responseMessages['signOut']);
    res.redirect("/");
}

const getForgotPassword = async (req, res, next) => {
    try {
        res.render('pages/users/forgot-password', {
            layout: 'login',
            title: 'Forgot Password'
        })
    } catch (error) {
        authLog.error(error)
        console.log("🚀 ~ registration ~ error:", error)
    }
}

const getRegistration = async (req, res, next) => {
    try {
        res.render('pages/users/registration', {
            layout: 'login',
            title: 'Registration'
        })
    } catch (error) {
        authLog.error(error)
        console.log("🚀 ~ registration ~ error:", error)
    }
}

const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email: email.trim() });
        return res.send((user) ? false : true);
    } catch (error) {
        console.log("🚀 ~ checkEmail ~ error:", error)
    }
}
const postRegistration = async (req, res, next) => {
    try {
        const { mobile, email, password } = req.body;

        let obj = {
            phone: mobile,
            email: email,
            password: saltedSha512(password, process.env.SHA512_SALT_KEY)
        }

        await userModel.create(obj);
        req.flash('success', responseMessages['registration']);
        res.redirect('/dashboard');
    } catch (error) {
        console.log("🚀 ~ postRegistration ~ error:", error)
    }
}

module.exports = {
    getLogin,
    postLogin,
    logout,
    checkEmail,
    getForgotPassword,
    getRegistration,
    postRegistration,
}