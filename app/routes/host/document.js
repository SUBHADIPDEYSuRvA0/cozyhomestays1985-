const express = require('express');
const router = express.Router();
const upload = require('../../multers/document');
const controller = require('../../controller/host/document.controller');
const hostMiddleware = require('../../middleware/hostmiddleware');

// Multer field config for dynamic owner file inputs
const uploadFields = [
  { name: 'idFront', maxCount: 1 },
  { name: 'idBack', maxCount: 1 },
  { name: 'gstDoc', maxCount: 1 },
  // Support up to 10 owners (expand if needed)
  ...Array.from({ length: 10 }).flatMap((_, i) => [
    { name: `multipleOwners[${i}].idFront`, maxCount: 1 },
    { name: `multipleOwners[${i}].idBack`, maxCount: 1 }
  ])
];

router.post(
  '/document-verification',hostMiddleware,
  upload.fields(uploadFields),
  controller.createOrUpdateVerification
);

module.exports = router;