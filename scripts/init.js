// Load environment variables
require('dotenv').config()

const mongoose = require('mongoose');
const userModel = require('../models/user');
const saltedSha512 = require('salted-sha512');

(async () => {
    try {
        console.log("Init script execution start", process.env.DB);

        // 1. Connect to admin DB
        const adminConn = new mongoose.mongo.MongoClient(process.env.MONGODB_ROOT_URL);
        await adminConn.connect();
        console.info('✅ Admin database connected.');

        try {
            const chatConn = new mongoose.mongo.MongoClient(process.env.DB);
            await chatConn.connect();
            console.log("Database connected successfully");
        } catch (error) {
            const db = adminConn.db("chat");
            await db.command({
                createUser: "chat",
                pwd: "chat",
                roles: [
                    { role: 'dbAdmin', db: "chat" },
                    { role: 'readWrite', db: "chat" }
                ],
            });

            console.info('👤 Chat DB user created.');
            // 3. Connect properly to tenant DB
            await mongoose.connect(process.env.DB);
            console.info('📡 Connected to chat database.');
        }

        console.log("Init Script Execution Done !!");

        process.exit(0);
    } catch (error) {
        console.error("Error while init script execution !!", error);
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }
})();