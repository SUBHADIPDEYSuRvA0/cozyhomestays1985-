const express = require('express');
const router = express.Router();
const multer = require('multer');

const propertyController = require('../../controller/host/createproperty.controller');
const hostMiddleware = require('../../middleware/hostmiddleware');
const upload = require('../../multers/fullproperty');

// Example multer setup


router.post('/create', hostMiddleware, propertyController.createProperty);
router.post('/:propertyId/createAddress', hostMiddleware, propertyController.createOrUpdatePropertyAddress);
router.post('/:propertyId/create', hostMiddleware, propertyController.saveListingType);
// router.post('/:propertyId/roomdetails',upload.array('media', 5), hostMiddleware, propertyController.createRoom);
router.post('/:propertyId/roomdetails',upload.array('mediaInput'), hostMiddleware, propertyController.postRoomDetails);
router.post('/:propertyId/amenities', hostMiddleware, propertyController.saveAmenities);
router.post('/:propertyId/rules', hostMiddleware, propertyController.createOrUpdatePolicy);
router.post('/:propertyId/pricing', hostMiddleware, propertyController.postPropertyPriceSetup);
router.post('/:propertyId/roomprice', hostMiddleware, propertyController.saveRoomPrices);


module.exports = router;