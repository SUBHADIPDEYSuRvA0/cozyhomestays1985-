const express = require('express');
const router = express.Router();

const gstController = require('../../controller/admin/gst.slap.controller');

router.post('/create', gstController.create);
router.post('/update/:id', gstController.update);

module.exports = router;  