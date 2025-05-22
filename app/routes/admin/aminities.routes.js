const express = require('express');
const router = express.Router();

const aminitiescontroller = require('../../controller/admin/admin.aminities.controller');

router.post('/create', aminitiescontroller.create);

module.exports = router;