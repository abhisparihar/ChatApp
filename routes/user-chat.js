const express = require('express');
const router = express.Router();
const { detail } = require('../controller/user-chat');

router.get("/:_id?", detail)


module.exports = router;