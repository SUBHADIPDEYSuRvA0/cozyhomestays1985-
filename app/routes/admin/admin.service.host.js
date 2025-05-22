const express = require('express');
const router = express.Router();


const serviceController = require('../../controller/admin/admin.servicehostschema');

router.post('/update/:id', serviceController.updateService);



module.exports = router;