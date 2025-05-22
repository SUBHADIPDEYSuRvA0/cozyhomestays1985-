const express = require('express');
const router = express.Router();
const upload = require('../../multers/rooms');
const roomController = require('../../controller/host/roomcontroller');

const hostMiddleware = require('../../middleware/hostmiddleware');

// List rooms for a property
router.get('/host/rooms/:propertyId', roomController.listRooms);

// Add rooms (multiple files for each room)
router.post(
  '/:propertyId/rooms/add',hostMiddleware,
  upload.any(),
  roomController.addRooms
);

// Delete a room (optional)
router.post('/:propertyId/rooms/:id/delete',hostMiddleware, roomController.deleteRoom);

module.exports = router;