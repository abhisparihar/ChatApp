const ObjectId = require("mongoose").Types.ObjectId;
const multer = require('multer');
var fs = require('fs');
const { paginationQuery } = require("../functions");
const { responseMessages } = require('../constant');
const userModel = require('../models/user');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'public/img';
        // Check if the "img" folder exists, if not, create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        console.log("🚀 ~ file:", file)
        cb(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
})

// Initialize multer with storage configuration
const upload = multer({ storage: storage }).single('profileImage');

const list = async (req, res, next) => {
    try {
        const { sort, skip, limit, page } = paginationQuery(req);

        const query = {
            isAdmin: false,
            isDeleted: false
        };

        const [list, totalRecords] = await Promise.all([
            userModel.find(query).sort(sort).skip(skip).limit(limit),
            userModel.countDocuments(query)
        ])

        res.render("pages/users/list", {
            title: "User List",
            active: "user-list",
            list: list,
            totalRecords: totalRecords,
            pagination: {
                page: page,
                totalPage: Math.ceil(totalRecords / limit),
                url: req.originalUrl,
                totalRecords: totalRecords,
                limit: limit,
                currentRecords: list.length,
            },
        })

    } catch (error) {
        console.log("🚀 ~ list ~ error:", error)
    }
}

const getEdit = async (req, res, next) => {
    try {
        const { _id } = req.params;

        const user = await userModel.findOne({ _id: new ObjectId(_id), isAdmin: false, isDeleted: false })
        res.render("pages/users/edit", {
            title: "Edit User",
            active: "edit-user",
            user: user
        })

    } catch (error) {
        console.log("🚀 ~ getEdit ~ error:", error)
    }
}

const postEdit = async (req, res, next) => {
    upload(req, res, async function (err) {
        try {
            const { _id } = req.params
            const { name, email, phone, } = req.body;

            const obj = {
                name: name,
                email: email,
                phone: phone,
                image: req.file?.path?.replace("public", "")
            }

            let isUserExists = await userModel.countDocuments({ _id: { $ne: new ObjectId(_id) }, email: email.trim(), isDeleted: false, })
            if (isUserExists) {
                req.flash("error", responseMessages['userAlreadyExists']);
                return res.redirect(`/users/edit/${_id}`);
            };
            await userModel.updateOne({ _id: new ObjectId(_id) }, { $set: obj })
            req.flash('success', responseMessages['userUpdated']);
            res.redirect('/users');
        } catch (error) {
            console.log("🚀 ~ postEdit ~ error:", error)
        }
    })
}

const deleteUser = async (req, res, next) => {
    try {
        const { _id } = req.params

        let isUserExists = await userModel.countDocuments({ _id: new ObjectId(_id), isDeleted: false, })
        if (!isUserExists) {
            req.flash("error", responseMessages['usrNotFound']);
            return res.redirect(`/users`);
        };
        await userModel.updateOne({ _id: new ObjectId(_id) }, { $set: { isDeleted: true } })
        req.flash('success', responseMessages['userDeleted']);
        res.redirect('/users');
    } catch (error) {
        console.log("🚀 ~ postEdit ~ error:", error)
    }
}

const getProfile = async (req, res, next) => {
    try {

        res.render("pages/users/profile", {
            title: "User Profile",
            active: "user-profile",
            user: req.user
        })
    } catch (error) {
        console.log("🚀 ~ profile ~ error:", error)
    }
}

const postProfile = async (req, res, next) => {
    try {
        const { name, title, email, dob, gender, country, state, postalCode, phone, address, agreement, fbURL, xURL, linkedinURL, instaURL, dribbleRL, dropBoxURL, googlePlusURL, pinterestURL, skypeURL, vineURL } = req.body;

        let obj = {
            name: name,
            email: email,
            phone: phone,
            title: title,
            dob: dob,
            gender: gender,
            country: country,
            state: state,
            postalCode: postalCode,
            address: address,
            agreement: agreement,
            fbURL: fbURL,
            xURL: xURL,
            linkedinURL: linkedinURL,
            instaURL: instaURL,
            dribbleRL: dribbleRL,
            dropBoxURL: dropBoxURL,
            googlePlusURL: googlePlusURL,
            pinterestURL: pinterestURL,
            skypeURL: skypeURL,
            vineURL: vineURL,
        };

        await userModel.updateOne({ _id: new ObjectId(req.user._id) }, { $ser: obj });
        res.redirect('/users/profile')

    } catch (error) {
        console.log("🚀 ~ postProfile ~ error:", error)

    }
}
module.exports = {
    list,
    getEdit,
    postEdit,
    deleteUser,
    getProfile,
    postProfile,
}