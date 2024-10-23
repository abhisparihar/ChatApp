// Load environment variables
require('dotenv').config()

const mongoose = require('mongoose');
const userModel = require('../models/user');
const saltedSha512 = require('salted-sha512');

(async () => {
    try {
        console.log("Init script execution start", process.env.DB);

        await mongoose.connect(process.env.DB);
        console.log("Database connected successfully");

        const admin = {
            name: "Super Admin",
            email: process.env.ADMIN_EMAIL,
            password: saltedSha512(process.env.ADMIN_PASSWORD, process.env.SHA512_SALT_KEY),
            mobile: process.env.ADMIN_MOBILE,
            phone:"0000000000",
            isAdmin: true
        };

        const isAdminExist = await userModel.countDocuments({ email: admin.email });

        if (!isAdminExist) {
            await userModel.create(admin);
            console.log("Admin Created !!");
        } else {
            console.log("Admin Already Exists");
        }

        console.log("Init Script Execution Done !!");

        process.exit(0);
    } catch (error) {
        console.error("Error while init script execution !!");
        console.log(error);
        process.exit(1);
    }
})();