
const Property = require('../../models/property');
const PropertyAddress = require('../../models/propertyaddress');
const Crypto = require('crypto');
const ListingType = require('../../models/propertylisttype');
// const roomdetails = require('../../models/roomdetails');
const fullproperty = require('../../models/fullproperty');
const propertyaminities = require('../../models/propertyaminities');
const propertypolicy = require('../../models/propertypolicy');
const RoomPrice = require('../../models/propertyroomprice');
const PropertyFullPrice = require('../../models/propertyfullprice');
const moment = require('moment');
// const roomdetails = require('../../models/roomdetails');
const mongoose = require('mongoose');
const property = require('../../models/property');
// const propertyaminities = require('../../models/propertyaminities');

class propertiesController {
  createProperty = async (req, res) => {
  try {
    const { categoryId,title } = req.body;

    if (!categoryId) {
      req.session.message = 'Category is required';
      return res.redirect('/host/selectcategory');
    }

    // Generate propertyId here in the controller:
    const propertyId = Crypto.randomBytes(8).toString('hex'); // 16-char hex string

    // Create new property with generated propertyId
    const property = new Property({
      propertyId,
      title,
      userId: req.user.id,
      categoryId,
    });

    await property.save();

    req.session.propertyId = property.propertyId;
    res.redirect(`/host/${property.propertyId}/selectmap`);
  } catch (error) {
    req.session.message = 'Failed to create property';
    res.redirect('/host/selectcategory');
  }
};
createOrUpdatePropertyAddress = async (req, res) => {
  try {
    const {
      propertyName,
      nearby,
      mapAddress,
      fullAddress,
      city,
      state,
      pincode,
      latitude,
      longitude,
    } = req.body;

    const propertyId = req.params.propertyId;
    const userId = req.user.id;

    if (!propertyName || !propertyId) {
      return res.redirect(`/host/${propertyId}/selectmap`);
    }

    // Update if found, else create new
    await PropertyAddress.findOneAndUpdate(
      { propertyId: propertyId }, // filter by propertyId
      {
        propertyName,
        nearby,
        mapAddress,
        fullAddress,
        city,
        state,
        pincode,
        latitude,
        longitude,
        userId,
        propertyId,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true } // upsert = create if not found
    );

    res.redirect(`/host/${propertyId}/listtype`);
  } catch (error) {
    const propertyId = req.params.propertyId;
    res.redirect(`/host/${propertyId}/selectmap`);
  }
};
saveListingType = async (req, res) => {
  try {
    const { listingType } = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user.id;  // assuming user is authenticated
    if (!listingType || !propertyId) {
      // Missing data, redirect back to form
      return res.redirect(`/host/${propertyId}/listtype`);
    }

    // Save or update listing type info
    await ListingType.findOneAndUpdate(
      { propertyId },
      { listingType, userId, propertyId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Redirect based on listingType value
    if (listingType === 'roomWise') {
      return res.redirect(`/host/${propertyId}/selectrooms`);
    } else if (listingType === 'entireProperty') {
      return res.redirect(`/host/${propertyId}/selectpropertyrooms`);
    } else {
      // default fallback redirect
      return res.redirect(`/host/${propertyId}/listtype`);
    }

  } catch (error) {
    const propertyId = req.params.propertyId;
    res.redirect(`/host/${propertyId}/listtype`);
  }
};

// room detail for roomwise

// postRoomDetails = async (req, res) => {
//   try {
//     const {
//       totalRooms,
//       totalAttendees,
//       totalSingleRooms,
//       totalDoubleRooms,
//       washroomStyle,
//       washroomType,
//     } = req.body;

//     let roomTypes = { single: false, double: false };
//     const roomTypeInput = req.body.roomType;
//     if (Array.isArray(roomTypeInput)) {
//       roomTypes.single = roomTypeInput.includes('Single');
//       roomTypes.double = roomTypeInput.includes('Double');
//     } else if (typeof roomTypeInput === 'string') {
//       if (roomTypeInput === 'Single') roomTypes.single = true;
//       if (roomTypeInput === 'Double') roomTypes.double = true;
//     }

//     const mediaInput = (req.files || []).map((file) => ({
//       filename: file.filename,
//       path: file.path,
//       mimetype: file.mimetype,
//       isMain: false // default
//     }));

//     // Ensure only one image is marked as main
//     const mainImageName = req.body.mainImage;
//     if (mainImageName) {
//       mediaInput.forEach(photo => {
//         if (
//           photo.filename === mainImageName ||
//           photo.path.includes(mainImageName)
//         ) {
//           photo.isMain = true;
//         } else {
//           photo.isMain = false;
//         }
//       });
//     } else if (mediaInput.length > 0) {
//       // If no mainImage is explicitly provided, make the first one main
//       mediaInput[0].isMain = true;
//     }

//     const room = new fullproperty({
//       propertyId: req.params.propertyId,
//       userId: req.user.id,
//       totalRooms,
//       totalAttendees,
//       roomTypes,
//       totalSingleRooms: totalSingleRooms || 0,
//       totalDoubleRooms: totalDoubleRooms || 0,
//       washroomStyle,
//       washroomType,
//       mediaInput
//     });

//     await room.save();
//     res.redirect('/some-next-step'); // Replace with your actual route
//   } catch (error) {
//     res.status(500).send('Server Error');
//   }
// };

postRoomDetails = async (req, res) => {
  try {
    const {
      totalRooms,
      maxAttendant,
      totalSingleRooms,
      totalDoubleRooms,
      washroomStyle,
      washroomType,
      addextrabed,
      addextrabed_charge,
      extraguistcharge,
    } = req.body;

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
    res.redirect(`/host/${req.params.propertyId}/selectpropertyrooms`);
  }
};


// propertyaminities
saveAmenities = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    let amenities = req.body.amenities || [];
    if (!Array.isArray(amenities)) {
      amenities = [amenities];
    }

    // Try to find the property first
    let property = await propertyaminities.findOne({ propertyId: propertyId })

    if (property) {
      // Update the amenities array and save
      property.amenities = amenities;
      await property.save();
    } else {
      // If not found, create a new property (must have a name)
      const name = req.body.name || "Untitled Property";
      property = new propertyaminities({
        propertyId, // use the provided propertyId if you want to keep the same id
        name,
        userId: req.user.id,
        amenities
      });
      await property.save();
    }

    // Redirect or respond as needed
    res.redirect(`/host/${req.params.propertyId}/rules`);
  } catch (err) {
   res.redirect(`/host/${req.params.propertyId}/selectaminities`);
  }
};


// propertyrules
createOrUpdatePolicy = async (req, res) => {
  try {
    const userId = req.user?.id || req.user || null;
    const propertyId = req.params.propertyId;

    // Parse input: refundPolicies will be an object of objects (indexed), rules an object/array
    let refundPolicies = [];
    if (req.body.refundPolicies) {
      refundPolicies = Object.values(req.body.refundPolicies);
    }
    let rules = [];
    if (req.body.rules) {
      rules = Object.values(req.body.rules).filter(r => r && r.trim() !== '');
    }

    // Find and update, or create if not exists
    await propertypolicy.findOneAndUpdate(
      { propertyId },
      { $set: { userId, refundPolicies, rules } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Fetch the listing type (assume you want a single document)
    const listingTypeDoc = await ListingType.findOne({ propertyId: propertyId });

    if (!listingTypeDoc) {
      // If no listing type found, redirect or handle as needed
      return res.redirect(`/host/${propertyId}/pricing`);
    }

    // Use the correct field as per your schema, e.g., listingTypeDoc.listtype or listingTypeDoc.listingType
    
      // Fallback for unexpected types
      return res.redirect(`/host/${propertyId}/pricing`);


  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving property policy.');
  }
};
postPropertyPriceSetup = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user;
    const propertyId = req.params.propertyId;
    const fullprice = Number(req.body.fullprice);

    // Handle dayWisePrices map if sent (optional)
    let dayWisePrices = {};
    if (req.body.dayWisePrices && typeof req.body.dayWisePrices === 'object') {
      dayWisePrices = req.body.dayWisePrices;
    }

    // Parse occationprice array from form data (OPTIONAL)
    let occationprice = [];
    if (
      req.body.occationprice &&
      req.body.occationprice.name &&
      (
        (Array.isArray(req.body.occationprice.name) && req.body.occationprice.name.some(v => v && v.trim() !== "")) ||
        (typeof req.body.occationprice.name === "string" && req.body.occationprice.name.trim() !== "")
      )
    ) {
      let names = Array.isArray(req.body.occationprice.name) ? req.body.occationprice.name : [req.body.occationprice.name];
      let startDates = Array.isArray(req.body.occationprice.startDate) ? req.body.occationprice.startDate : [req.body.occationprice.startDate];
      let endDates = Array.isArray(req.body.occationprice.endDate) ? req.body.occationprice.endDate : [req.body.occationprice.endDate];
      let prices = Array.isArray(req.body.occationprice.price) ? req.body.occationprice.price : [req.body.occationprice.price];
      for (let i = 0; i < names.length; i++) {
        // Only push if at least one field is filled
        if (
          (names[i] && names[i].trim() !== "") ||
          (startDates[i] && startDates[i].trim() !== "") ||
          (endDates[i] && endDates[i].trim() !== "") ||
          (prices[i] && prices[i].toString().trim() !== "")
        ) {
          occationprice.push({
            name: names[i] ? names[i].trim() : undefined,
            startDate: startDates[i] ? new Date(startDates[i]) : undefined,
            endDate: endDates[i] ? new Date(endDates[i]) : undefined,
            price: prices[i] ? Number(prices[i]) : undefined
          });
        }
      }
      // Remove any where all fields are empty (in case user added then removed)
      occationprice = occationprice.filter(o => o.name && o.name.trim() !== "");
    }

    // Discount object
    const discount = {
      isActive: req.body.discount_isActive === 'on' || req.body.discount_isActive === true || req.body.discount_isActive === 'true',
      bookingsLimit: Number(req.body.discount_bookingsLimit || 3),
      percentage: Number(req.body.discount_percentage || 0)
    };

    // Parse check-in/check-out times from the form ("HH:mm" or ISO string)
    function timeToDateObj(timeStr) {
      if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) return null;
      const today = new Date();
      const [hh, mm] = timeStr.split(':');
      today.setHours(Number(hh), Number(mm), 0, 0);
      return today;
    }
    let cheakInTime = req.body.checkInTime ? timeToDateObj(req.body.checkInTime) : null;
    let cheakOutTime = req.body.checkOutTime ? timeToDateObj(req.body.checkOutTime) : null;

    // Find referenced documents
    const Propertycategory = await Property.findOne({ propertyId });
    const propertyListingType = await ListingType.findOne({ propertyId });
    const PropertyPolicy = await propertypolicy.findOne({ propertyId });
    const Fullproperty = await fullproperty.findOne({ propertyId });
    const propertyaddress = await PropertyAddress.findOne({ propertyId });
    const propertyaminiti = await propertyaminities.findOne({ propertyId });
 console.log("propertyaminiti", propertyaminiti);
 console.log("propertyaddress", propertyaddress);
 console.log("Fullproperty", Fullproperty);
 console.log("PropertyPolicy", PropertyPolicy);
 console.log("propertyListingType", propertyListingType);
 console.log("Propertycategory", Propertycategory);
 console.log("propertyId", propertyId);
    // Defensive checks to avoid ._id of undefined
    if (!Propertycategory || !propertyListingType || !PropertyPolicy || !Fullproperty || !propertyaddress) {
      return res.status(400).send('Missing related property data. Please complete all previous steps.');
    }


   
    // Upsert main document
    await PropertyFullPrice.findOneAndUpdate(
      { propertyId },
      {
        userId,
        propertyId,
        fullprice,
        dayWisePrices,
        occationprice, // will be [] if empty, otherwise valid
        discount,
        cheakInTime,
        cheakOutTime,
        propertycategory: Propertycategory._id,
        propertyListingType: propertyListingType._id,
        PropertyPolicy: PropertyPolicy._id,
        fullproperty: Fullproperty._id,
        PropertyAddress: propertyaddress._id,
        propertyaminities: propertyaminiti._id,
        updatedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.redirect(`/host/${propertyId}/animation`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving property price details.');
  }
};


// saveRoomPrices = async (req, res) => {
//   // Helper for safe Date parsing (accepts both datetime-local and Date)
//   function safeDate(val) {
//     // Accepts ISO string from <input type="datetime-local"> (e.g. '2025-05-21T03:22')
//     const d = new Date(val);
//     return isNaN(d.getTime()) ? null : d;
//   }

//   try {
//     const {
//       propertyId,
//       roomId,
//       basePrice,
//       dayWisePrices,
//       occasionName,
//       occasionStart,
//       occasionEnd,
//       occasionPrice,
//       discountIsActive,
//       discountBookingsLimit,
//       discountPercentage,
//       checkInTime,
//       checkOutTime
//     } = req.body;

//     const roomIds = Array.isArray(roomId) ? roomId : [roomId];
//     const basePrices = Array.isArray(basePrice) ? basePrice : [basePrice];
//     const checkInTimes = Array.isArray(checkInTime) ? checkInTime : [checkInTime];
//     const checkOutTimes = Array.isArray(checkOutTime) ? checkOutTime : [checkOutTime];

//     const [
//       propertyCategory,
//       listingType,
//       policy,
//       fullProp,
//       address
//     ] = await Promise.all([
//       property.findOne({ propertyId }),
//       ListingType.findOne({ propertyId }),
//       propertypolicy.findOne({ propertyId }),
//       roomdetails.findOne({ propertyId }),
//       PropertyAddress.findOne({ propertyId }),
//     ]);

//     if (!propertyCategory || !listingType || !policy || !fullProp || !address) {
//       return res.status(400).send('One or more related documents not found.');
//     }

//     for (let i = 0; i < roomIds.length; i++) {
//       // Occasion prices for this room
//       const occasions = [];
//       if (occasionName && occasionName[i]) {
//         const names = Array.isArray(occasionName[i]) ? occasionName[i] : [occasionName[i]];
//         const starts = Array.isArray(occasionStart && occasionStart[i]) ? occasionStart[i] : [occasionStart && occasionStart[i]];
//         const ends = Array.isArray(occasionEnd && occasionEnd[i]) ? occasionEnd[i] : [occasionEnd && occasionEnd[i]];
//         const prices = Array.isArray(occasionPrice && occasionPrice[i]) ? occasionPrice[i] : [occasionPrice && occasionPrice[i]];
//         for (let j = 0; j < names.length; j++) {
//           if (names[j] && starts[j] && ends[j] && prices[j]) {
//             const startDate = safeDate(starts[j]);
//             const endDate = safeDate(ends[j]);
//             if (!startDate || !endDate) {
//               return res.status(400).send('Invalid occasion start or end date provided.');
//             }
//             occasions.push({
//               name: names[j],
//               startDate,
//               endDate,
//               price: Number(prices[j])
//             });
//           }
//         }
//       }

//       // Discount info for this room
//       const discount = {
//         isActive: !!(
//           discountIsActive &&
//           (Array.isArray(discountIsActive) ? discountIsActive[i] : discountIsActive)
//         ),
//         bookingsLimit: Number(
//           (discountBookingsLimit && discountBookingsLimit[i]) || 3
//         ),
//         percentage: Number(
//           (discountPercentage && discountPercentage[i]) || 0
//         ),
//         usedCount: 0
//       };

//       // Day-wise prices for this room
//       let dwPrices = {};
//       if (dayWisePrices && dayWisePrices[i]) {
//         for (const day in dayWisePrices[i]) {
//           const val = dayWisePrices[i][day];
//           if (val !== '' && val !== undefined) {
//             dwPrices[day] = Number(val);
//           }
//         }
//       }

//       // Validate check-in/check-out (should be ISO datetime string)
//       const inTime = safeDate(checkInTimes[i]);
//       const outTime = safeDate(checkOutTimes[i]);
//       if (!inTime || !outTime) {
//         return res.status(400).send('Invalid check-in or check-out date provided.');
//       }

//       const updateDoc = {
//         userId: req.user._id,
//         propertyId,
//         roomId: new mongoose.Types.ObjectId(roomIds[i]),
//         basePrice: Number(basePrices[i]),
//         dayWisePrices: dwPrices,
//         occasionPrices: occasions,
//         discount,
//         checkInTime: inTime,
//         checkOutTime: outTime,
//         propertycategory: propertyCategory._id,
//         propertyListingType: listingType._id,
//         PropertyPolicy: policy._id,
//         fullproperty: fullProp._id,
//         PropertyAddress: address._id,
//         updatedAt: new Date()
//       };

//       await RoomPrice.findOneAndUpdate(
//         { roomId: updateDoc.roomId },
//         updateDoc,
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
//     }

//     return res.redirect(`/host/${propertyId}/animation`);
//   } catch (err) {
//     console.error('Error saving room prices:', err);
//     return res.status(500).send('Server Error');
//   }
// };


saveRoomPrices = async (req, res) => {
  // Helper for safe time parsing from "HH:mm"
  function safeTime(val) {
    // Accepts "HH:mm" and returns a Date with a fixed date (e.g., 1970-01-01THH:mm:00Z)
    if (/^\d{2}:\d{2}$/.test(val)) {
      const [h, m] = val.split(':');
      // Use UTC for time storage
      return new Date(Date.UTC(1970, 0, 1, Number(h), Number(m)));
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  try {
    const {
      propertyId,
      roomId,
      basePrice,
      dayWisePrices,
      occasionName,
      occasionStart,
      occasionEnd,
      occasionPrice,
      discountIsActive,
      discountBookingsLimit,
      discountPercentage,
      checkInTime,
      checkOutTime
    } = req.body;

    const roomIds = Array.isArray(roomId) ? roomId : [roomId];
    const basePrices = Array.isArray(basePrice) ? basePrice : [basePrice];
    const checkInTimes = Array.isArray(checkInTime) ? checkInTime : [checkInTime];
    const checkOutTimes = Array.isArray(checkOutTime) ? checkOutTime : [checkOutTime];

    const [
      propertyaminiti,
      propertyCategory,
      listingType,
      policy,
      fullProp,
      address
    ] = await Promise.all([
      property.findOne({ propertyId }),
      ListingType.findOne({ propertyId }),
      propertypolicy.findOne({ propertyId }),
      roomdetails.findOne({ propertyId }),
      PropertyAddress.findOne({ propertyId }),
      propertyaminities.findOne({ propertyId })
    ]);

    if (!propertyCategory || !listingType || !policy || !fullProp || !address) {
      return res.status(400).send('One or more related documents not found.');
    }

    for (let i = 0; i < roomIds.length; i++) {
      // Occasion prices for this room
      const occasions = [];
      if (occasionName && occasionName[i]) {
        const names = Array.isArray(occasionName[i]) ? occasionName[i] : [occasionName[i]];
        const starts = Array.isArray(occasionStart && occasionStart[i]) ? occasionStart[i] : [occasionStart && occasionStart[i]];
        const ends = Array.isArray(occasionEnd && occasionEnd[i]) ? occasionEnd[i] : [occasionEnd && occasionEnd[i]];
        const prices = Array.isArray(occasionPrice && occasionPrice[i]) ? occasionPrice[i] : [occasionPrice && occasionPrice[i]];
        for (let j = 0; j < names.length; j++) {
          if (names[j] && starts[j] && ends[j] && prices[j]) {
            const startDate = new Date(starts[j]);
            const endDate = new Date(ends[j]);
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              return res.status(400).send('Invalid occasion start or end date provided.');
            }
            occasions.push({
              name: names[j],
              startDate,
              endDate,
              price: Number(prices[j])
            });
          }
        }
      }

      // Discount info for this room
      const discount = {
        isActive: !!(
          discountIsActive &&
          (Array.isArray(discountIsActive) ? discountIsActive[i] : discountIsActive)
        ),
        bookingsLimit: Number(
          (discountBookingsLimit && discountBookingsLimit[i]) || 3
        ),
        percentage: Number(
          (discountPercentage && discountPercentage[i]) || 0
        ),
        usedCount: 0
      };

      // Day-wise prices for this room
      let dwPrices = {};
      if (dayWisePrices && dayWisePrices[i]) {
        for (const day in dayWisePrices[i]) {
          const val = dayWisePrices[i][day];
          if (val !== '' && val !== undefined) {
            dwPrices[day] = Number(val);
          }
        }
      }

      // Validate check-in/check-out (should be "HH:mm" and stored as Date)
      const inTime = safeTime(checkInTimes[i]);
      const outTime = safeTime(checkOutTimes[i]);
      if (!inTime || !outTime) {
        return res.status(400).send('Invalid check-in or check-out time provided.');
      }

      const updateDoc = {
        userId: req.user.id,
        propertyId,
        roomId: new mongoose.Types.ObjectId(roomIds[i]),
        basePrice: Number(basePrices[i]),
        dayWisePrices: dwPrices,
        occasionPrices: occasions,
        discount,
        checkInTime: inTime,
        checkOutTime: outTime,
        propertycategory: propertyCategory._id,
        propertyListingType: listingType._id,
        PropertyPolicy: policy._id,
        fullproperty: fullProp._id,
        PropertyAddress: address._id,
        propertyaminities: propertyaminiti._id,
        updatedAt: new Date()
      };

      await RoomPrice.findOneAndUpdate(
        { roomId: updateDoc.roomId },
        updateDoc,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.redirect(`/host/${propertyId}/animation`);
  } catch (err) {
    console.error('Error saving room prices:', err);
    return res.status(500).send('Server Error');
  }
};


}
module.exports = new propertiesController