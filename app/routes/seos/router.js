const express = require('express');
const router = express.Router();

const seosController = require('../../controller/seos.js/seocontroller');

const Seomiddleware = require('../../middleware/seo');
router.post('/add',Seomiddleware, seosController.addSeoKeyword);
router.post('/edit',Seomiddleware, seosController.editSeoKeywords);
router.get('/get',Seomiddleware, seosController.getSeo);

module.exports = router;
