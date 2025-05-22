const express = require('express');
const router = express.Router();

const authController = require('../../controller/host/auth.host.controller');

router.post('/login', authController.login);
router.post('/register', authController.signup);
router.post('/sendotp', authController.sendOtp);
router.get('/logout', authController.logout);

module.exports = router;