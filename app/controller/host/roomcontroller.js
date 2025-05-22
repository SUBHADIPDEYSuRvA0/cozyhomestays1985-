// const Room = require('../../models/roomdetails');
const path = require('path');
const fs = require('fs');
const fullproperty = require('../../models/fullproperty');

// Add Room(s) Controller



 exports.addRooms= async (req, res) => {
  try {
    const {
     
      maxAttendant,
      totalSingleRooms,
      totalDoubleRooms,
      washroomStyle,
      washroomType,
      addextrabed,
      addextrabed_charge,
      extraguistcharge,
    } = req.body;
 const  totalRooms = 1;
    // Room Types
    let roomTypes = { single: false, double: false };
    const roomTypeInput = req.body.roomType;
    if (Array.isArray(roomTypeInput)) {
      roomTypes.single = roomTypeInput.includes('Single');
      roomTypes.double = roomTypeInput.includes('Double');
    } else if (typeof roomTypeInput === 'string') {
      if (roomTypeInput === 'Single') roomTypes.single = true;
      if (roomTypeInput === 'Double') roomTypes.double = true;
    }

    // Media (Images/Videos)
    const mediaInput = (req.files || []).map((file) => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      isMain: false // default, will set below
    }));

    // Main image selection logic (uses index sent from frontend)
    const mainImageIndex = parseInt(req.body.mainImage, 10);
    if (!isNaN(mainImageIndex) && mediaInput[mainImageIndex]) {
      mediaInput.forEach((photo, idx) => {
        photo.isMain = idx === mainImageIndex;
      });
    } else if (mediaInput.length > 0) {
      mediaInput[0].isMain = true;
    }

    // Parse booleans and numbers for extra bed fields
    const addExtraBedBool = addextrabed === 'true' || addextrabed === true;
    const addExtraBedChargeNum = addExtraBedBool ? Number(addextrabed_charge) || 0 : 0;
    const extraGuestChargeNum = addExtraBedBool ? Number(extraguistcharge) || 0 : 0;

    // Check if document exists for propertyId
    let room = await fullproperty.findOne({
      propertyId: req.params.propertyId,
      userId: req.user.id
    });

    if (room) {
      // Update existing document
      room.totalRooms = totalRooms;
      room.maxAttendant = maxAttendant;
      room.roomTypes = roomTypes;
      room.totalSingleRooms = totalSingleRooms || 0;
      room.totalDoubleRooms = totalDoubleRooms || 0;
      room.washroomStyle = washroomStyle;
      room.washroomType = washroomType;
      room.mediaInput = mediaInput;
      room.addextrabed = addExtraBedBool;
      room.addextrabed_charge = addExtraBedChargeNum;
      room.extraguistcharge = extraGuestChargeNum;
      await room.save();
    } else {
      // Create new document
      room = new fullproperty({
        propertyId: req.params.propertyId,
        userId: req.user.id,
        totalRooms,
        maxAttendant,
        roomTypes,
        totalSingleRooms: totalSingleRooms || 0,
        totalDoubleRooms: totalDoubleRooms || 0,
        washroomStyle,
        washroomType,
        mediaInput,
        addextrabed: addExtraBedBool,
        addextrabed_charge: addExtraBedChargeNum,
        extraguistcharge: extraGuestChargeNum
      });
      await room.save();
    }

    res.redirect(`/host/${req.params.propertyId}/selectaminities`);
  } catch (error) {
    console.error(error);
    res.redirect(`/host/${req.params.propertyId}/selectpropertyrooms`);
  }
};
// List Rooms Controller
exports.listRooms = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const rooms = await Room.find({ propertyId });
    res.render('rooms/list', { rooms, propertyId });
  } catch (err) {
    res.status(500).send('Error fetching rooms');
  }
};

// Delete Room Controller
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Room.findById(id);

    if (!room) return res.status(404).send('Room not found');

    // Optionally, delete files from disk
    if (room.mediaInput && Array.isArray(room.mediaInput)) {
      for (const media of room.mediaInput) {
        const mediaPath = path.join(__dirname, '../../', media.path);
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
      }
    }

    await Room.findByIdAndDelete(id);
    res.redirect('back');
  } catch (err) {
    res.status(500).send('Could not delete room');
  }
};