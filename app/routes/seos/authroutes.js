const express = require('express');
const router = express.Router();

const seosController = require('../../controller/seos.js/auth.seo.controller');

router.post('/login', seosController.login);
router.get('/logout', seosController.logout);
router.get('/', seosController.Log);


module.exports = router;