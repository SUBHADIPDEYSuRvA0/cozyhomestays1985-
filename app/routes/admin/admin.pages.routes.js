const express = require('express');
const router = express.Router();
const pagesController = require('../../controller/admin/pages.controller');

router.get('/', pagesController.login);
router.get('/dashboard', pagesController.index);
router.get('/category', pagesController.category);
router.get('/aminities', pagesController.aminiti);
router.get('/gst', pagesController.gst);
router.get('/service', pagesController.service);
router.get('/map', pagesController.map);
router.get('/servicehost', pagesController.servicehost);
router.get('/allproperties', pagesController.allpropertiesandrooms);
router.get('/property/:propertyId', pagesController.findPropertyById);

module.exports = router;