const express = require('express');
const router = express.Router();


const serviceController = require('../../controller/admin/admin.service.controller');

router.post('/update/:id', serviceController.updateService);



module.exports = router;