const ObjectId = require("mongoose").Types.ObjectId;
const { paginationQuery } = require("../functions");
const { responseMessages } = require('../constant');
const userModel = require('../models/user');

const detail = async (req, res, next) => {
    try {
        io.on('connection', (socket) => {
            socket.on('chat message', (msg) => {
                console.log("🚀 ~ socket.on ~ msg:", msg)
                io.emit('chat message', msg);
            });
        });
        const { _id } = req.params
        const { sort, skip, limit, page } = paginationQuery(req);

        const query = {
            isAdmin: false,
            isDeleted: false,
            _id: { $ne: req.user._id }
        };
        const [list, totalRecords] = await Promise.all([
            userModel.find(query).sort(sort).skip(skip).limit(limit),
            userModel.countDocuments(query),
        ])

        let user;
        if (!_id) {
            user = await userModel.findOne({ _id: new ObjectId(list[0]._id) })
        } else {
            user = await userModel.findOne({ _id: new ObjectId(_id) })
        }

        res.render("pages/user-chat", {
            layout: 'message',
            title: "User Chat Details",
            active: "user-chat-details",
            user: user,
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
module.exports = {
    detail
}