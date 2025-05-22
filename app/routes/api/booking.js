const express = require('express');
const router = express.Router();
const bookingController = require('../../controller/api/bookingcontroller');

router.post('/booking',  bookingController.createBooking);
module.exports = router;