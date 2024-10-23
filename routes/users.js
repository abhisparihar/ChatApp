const express = require('express');
const router = express.Router();
const { list, getEdit, postEdit, deleteUser, getProfile,postProfile } = require('../controller/user');

/* GET users listing. */
router.get('/', list);
router.get('/edit/:_id', getEdit);
router.post('/edit/:_id', postEdit);
router.delete('/delete/:_id', deleteUser);
router.get('/profile', getProfile);
router.post('/profile', postProfile);

module.exports = router;
