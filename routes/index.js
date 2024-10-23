var express = require('express');
var router = express.Router();
const { getLogin, getRegistration, postLogin, getForgotPassword, logout, checkEmail, postRegistration } = require('../controller/index');

/* GET home page. */
router.get('/', getLogin);
router.post('/', postLogin);
router.get('/logout', logout);
router.post('/check-email', checkEmail)
router.get('/registration', getRegistration);
router.post('/registration', postRegistration);
router.get('/forgot-password', getForgotPassword);

module.exports = router;
