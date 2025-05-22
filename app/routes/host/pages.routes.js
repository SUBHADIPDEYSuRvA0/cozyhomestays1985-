const express = require('express');
const router = express.Router();
const pagesController = require('../../controller/host/pages.controller');
const hostMiddleware = require('../../middleware/hostmiddleware');

router.get('/', pagesController.login);
router.get('/list1',hostMiddleware ,pagesController.list1);
router.get('/selectcategory',hostMiddleware, pagesController.list2);
router.get('/:propertyId/selectmap',hostMiddleware, pagesController.list3);
router.get('/:propertyId/listtype',hostMiddleware, pagesController.list4);
router.get('/:propertyId/selectrooms', hostMiddleware,pagesController.list5);
router.get('/:propertyId/selectpropertyrooms',hostMiddleware, pagesController.list6);
router.get('/:propertyId/selectaminities', hostMiddleware,pagesController.list7);
router.get('/:propertyId/rules',hostMiddleware, pagesController.list8);
router.get('/:propertyId/animation',hostMiddleware, pagesController.animation);
router.get('/:propertyId/pricing',hostMiddleware, pagesController.getPropertyPriceCalendar);
// router.get('/:propertyId/roomprice',hostMiddleware, pagesController.showRoomPrices);
router.get('/dashboard',hostMiddleware, pagesController.getDocumentVerificationForm);
// router.get('/rooms',hostMiddleware, pagesController.rooms);

// pages

router.get('/home',hostMiddleware, pagesController.dashboard);




module.exports = router;