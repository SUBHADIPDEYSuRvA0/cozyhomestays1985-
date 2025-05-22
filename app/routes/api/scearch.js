const express = require('express');
const router = express.Router();
const bookingController = require('../../controller/api/scearch');

router.get('/scearch', bookingController.searchAllProperties);
router.get('/aminities', bookingController.searchByAmenityIds);
module.exports = router;