const aminities = require("../../models/aminities");
const category = require("../../models/category");
const propertyaddress = require("../../models/propertyaddress");
const propertyaminities = require("../../models/propertyaminities");
const propertyfullprice = require("../../models/propertyfullprice");
const propertylisttypes = require("../../models/propertylisttype");
const propertypolicy = require("../../models/propertypolicy");
// const roomdetails = require("../../models/roomdetails");
const serviceHost = require("../../models/service.host");

const DocumentVerification = require('../../models/documentation');

const RoomPrice = require('../../models/propertyroomprice');
const moment = require('moment');
const user = require("../../models/user");
const fullproperty = require("../../models/fullproperty");
const { default: mongoose } = require("mongoose");


class pagescontroller {
    login(req, res) {
        const message = req.session.message;
         delete req.session.message; 
        res.render('Host/login',{message});
    }
    list1=async(req, res) =>{
         const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
       
        res.render('Host/list1',{user});

    }
    list2= async(req, res) => {

        const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
      
        const categories = await category.find();
        res.render('Host/list2category',{categories,user,message});
    }
    list3 = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    const message = req.session.message;
    delete req.session.message;

    let map = await propertyaddress.findOne({ propertyId: propertyId });

    if (!map) {
      map = {
        propertyName: "",
        nearby: "",
        fullAddress: "",
        mapAddress: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
      };
    }

    const user = req.user.id;

    res.render('Host/list3map', { user, message, propertyId, map });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

    list4=async(req, res) =>{
         const propertyId = req.params.propertyId
         const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
        res.render('Host/list4listtype',{user,message,propertyId,propertyId});
    }
    list5=async(req, res) => {
        const propertyId = req.params.propertyId
         const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
        res.render('Host/list5selectrooms',{user,message,propertyId});
    }
    list6=async(req, res) => {
        const propertyId = req.params.propertyId
         const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
         const room = await fullproperty.findOne({
      propertyId,
      userId: req.user.id
    }).lean();
        res.render('Host/list6selecroom',{user,message,propertyId,room});
    }
 list7 = async (req, res) => {
    const propertyId = req.params.propertyId;
    const message = req.session.message;
    delete req.session.message;
    const user = req.user.id;
    const aminity = await aminities.find();
  
    // Find by propertyId and current logged-in user

    const propertylisttype = await propertylisttypes.findOne({ propertyId });

    // Find the property and its amenities
    let selectedAmenities = [];
    const property = await propertyaminities.findOne({propertyId: propertyId });
    if (property && Array.isArray(property.amenities)) {
        selectedAmenities = property.amenities.map(id => id.toString());
    }

    res.render('Host/list7aminities', {
        aminities: aminity,
        user,
        message,
        propertyId,
        propertylisttype,
        selectedAmenities // <-- Always pass this!
    });
}
list8 = async (req, res) => {
    const propertyId = req.params.propertyId;
    const message = req.session.message;
    delete req.session.message;
    const user = req.user.id;

    // Fetch existing policy if any
    const existing = await propertypolicy.findOne({ propertyId });

    res.render('Host/list8rules', {
        user,
        message,
        propertyId,
        refundPolicies: existing ? existing.refundPolicies : [],
        rules: existing ? existing.rules : []
    });
};



    animation=async(req, res) => {
        const propertyId = req.params.propertyId
         const message = req.session.message;
         delete req.session.message; 
        const user = req.user.id
        res.render('Host/lastanimation',{user,message,propertyId});
    }
 getPropertyPriceCalendar = async (req, res) => {
  try {
    const propertyId = req.params.propertyId;
    // month and year from query string, default to this month
    const month = Number(req.query.month) || (moment().month() + 1); // 1-based
    const year = Number(req.query.year) || moment().year();

    const data = await propertyfullprice.findOne({ propertyId }).lean();
    const service = await serviceHost.findOne();
    const servicerate = service ? service.servicerate : 0;

    // Compose calendar for this month
    const daysInMonth = moment({ year, month: month - 1 }).daysInMonth();
    const days = [];

    // Prepare day-wise prices (may be a Map in Mongo, so convert if needed)
    const dayWisePrices = (data && data.dayWisePrices)
      ? (typeof data.dayWisePrices.entries === 'function'
          ? Object.fromEntries(data.dayWisePrices.entries())
          : data.dayWisePrices)
      : {};

    const basePrice = data && data.fullprice ? data.fullprice : 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const cur = moment({ year, month: month - 1, day: d });
      let price = basePrice;
      let occ = null;

      // Occasion price check
      if (data && data.occationprice && data.occationprice.length) {
        occ = data.occationprice.find(o =>
          cur.isBetween(moment(o.startDate).startOf('day'), moment(o.endDate).endOf('day'), null, '[]')
        );
        if (occ) price = occ.price;
      }

      // Day-wise price (if no occasion override)
      if (!occ && dayWisePrices) {
        const dayName = cur.format('dddd'); // e.g. 'Monday'
        if (dayWisePrices[dayName]) price = dayWisePrices[dayName];
      }

      // Discount logic
      let discount = 0;
      if (data && data.discount && data.discount.isActive && data.discount.percentage > 0) {
        discount = price * data.discount.percentage / 100;
      }
      const discountedPrice = (discount > 0) ? price - discount : null;

      // Platform and host calculations
      const platformFee = (price * servicerate) / 100;
      const hostGets = price - platformFee;
      let discPlatformFee = null, discHostGets = null;
      if (discountedPrice !== null) {
        discPlatformFee = (discountedPrice * servicerate) / 100;
        discHostGets = discountedPrice - discPlatformFee;
      }

      days.push({
        date: cur.format('YYYY-MM-DD'),
        price,
        platformFee,
        hostGets,
        occasion: occ ? occ.name : null,
        discountedPrice,
        discPlatformFee,
        discHostGets,
      });
    }

    // For year/month navigation
    const nowYear = moment().year();
    const firstYear = nowYear;
    const lastYear = firstYear + 9;

    res.render('Host/fullpropertypriceset', {
      propertyId,
      message: req.session && req.session.message,
      user: req.user.id,
      days,
      month,
      year,
      firstYear,
      lastYear,
      data,
      servicerate
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading property price calendar.');
  }
};


// price

// showRoomPrices = async (req, res) => {
//   const propertyId = req.params.propertyId;
//   const rooms = await roomdetails.find({ propertyId });
//   const prices = await RoomPrice.find({ propertyId }).lean();

   
//     const message = req.session.message;
//     delete req.session.message;
//     const user = req.user.id;
//   // Create a map for quick lookup: roomId -> price doc
//   const priceMap = {};
//   prices.forEach(price => { priceMap[price.roomId.toString()] = price; });

//   res.render('Host/roomwiseprice', {
//     propertyId,
//     rooms,
//     priceMap,
//     user,
//     message
//   });
// };
// showRoomPrices = async (req, res) => {
//   try {
//     const propertyId = req.params.propertyId;

//     // Get rooms for this property (adjust if your Room model differs)
//     const rooms = await roomdetails.find({ propertyId: propertyId });

//     const priceMap = {};
//     const servicerate = 10; // or fetch from config/settings/db

//     // Get all room price docs for this property
//     const allPrices = await RoomPrice.find({ propertyId }).lean();
//     allPrices.forEach(p => priceMap[p.roomId.toString()] = p);

//     // Build roomCalendars for 1 year (or as needed)
//     const fromDate = new Date();
//     const toDate = new Date();
//     toDate.setFullYear(toDate.getFullYear() + 1);

//     // Call correct function for roomCalendars
//     const roomCalendars = await getRoomCalendars(propertyId, fromDate, toDate, servicerate);

//     const message = req.session?.message;
//     if (req.session) delete req.session.message;

//     const user = req.user._id || req.user.id || null;

//     res.render('Host/roomwiseprice', {
//       propertyId,
//       rooms,
//       priceMap,
//       roomCalendars,
//       servicerate,
//       message,
//       user
//     });
//   } catch (err) {
//     console.error("RoomPrices GET error", err);
//     res.status(500).send("Could not load room pricing form.");
//   }
// };

getDocumentVerificationForm = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch existing document verification entry (if any)
    const docData = await DocumentVerification.findOne({ userId }).lean();

    const users= await user.findById(userId).lean();

    if (users.documentverification===true) {
      return res.redirect('/host/home');

    };

    // If user is already verified, show message or redirect
    if (docData && docData.isVerified) {
      return res.render('Host/adddocuments', {
        title: 'Document Verification',
        user: users,
        alreadyVerified: true,
        document: docData
      });
      // Or simply: return res.redirect('/dashboard');
    }

    // Not verified or no entry yet, show form
    res.render('Host/adddocuments', {
      title: 'Document Verification',
      user:users,
      alreadyVerified: false,
      document: docData // could be null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading document verification form');
  }
};

// pages

 dashboard = async (req, res) => {
  try {
    const userId = req.user.id;
   
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    // Populate all referenced fields
    const propertyPrices = await propertyfullprice.find({ userId })
      .populate('propertycategory')  // PropertyCategory schema
      .populate('propertyListingType') // ListingType schema
      .populate('PropertyPolicy') // PropertyPolicy schema
      .populate('fullproperty') // fullproperty (room) schema
      .populate('PropertyAddress') // PropertyAddress schema
      .populate('propertyaminities')
      .lean();

    if (!propertyPrices || propertyPrices.length === 0) {
      return res.status(404).json({ message: 'No property prices found for this user' });
    }

    const today = moment().startOf('day');

    const results = propertyPrices.map(propertyPrice => {
      let finalPrice;
      let source = '';

      // Check for occasion price
      const occation = (propertyPrice.occationprice || []).find(occ => {
        const start = moment(occ.startDate).startOf('day');
        const end = moment(occ.endDate).endOf('day');
        return today.isSameOrAfter(start) && today.isSameOrBefore(end);
      });

      if (occation) {
        finalPrice = occation.price;
        source = 'Occasion Price';
      } else {
        const dayName = today.format('dddd');
        if (propertyPrice.dayWisePrices && propertyPrice.dayWisePrices.hasOwnProperty(dayName)) {
          finalPrice = propertyPrice.dayWisePrices[dayName];
          source = 'Daywise Price';
        } else {
          finalPrice = propertyPrice.fullprice;
          source = 'Base Price';
        }
      }

       return {
        ...propertyPrice, // Spread all fields of PropertyFullPrice
        finalPrice,
        priceSource: source
        // All populated fields will be included (propertycategory, propertyListingType, PropertyPolicy, fullproperty, PropertyAddress)
      };

     
    });

    // No merge! Send as separate arrays:
    res.render('Host/dashboard', {
       properties: results,

      // propertyItems,
      // roomItems,
      // userLogin: req.user,
      // alreadyVerified: req.user.alreadyVerified,
      // currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss'),
      // moment
    });
  } catch (error) {
    console.error('Error fetching rooms by user:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
}

// rooms = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     if (!userId) return res.status(400).json({ message: 'userId is required' });

//     // Fetch all RoomPrice docs for this user, and populate references
//     const roomPrices = await RoomPrice.find({ userId })
//       .populate('roomId') // Room details
//       .populate('propertycategory') // PropertyCategory
//       .populate('propertyListingType') // ListingType
//       .populate('PropertyPolicy') // PropertyPolicy
//       .populate('fullproperty') // PropertyAminity (your naming)
//       .populate('PropertyAddress') // PropertyAddress
//       .populate('propertyaminities')
//       .lean();
// // console.log(roomPrices);
//     if (!roomPrices || roomPrices.length === 0) {
//       return res.status(404).json({ message: 'No room prices found for this user' });
//     }

//     const today = moment().startOf('day');
//     const dayName = today.format('dddd'); // E.g. "Monday"

//     const results = roomPrices.map(roomPrice => {
//       let finalPrice;
//       let priceSource = '';

//       // 1. Check for occasion price
//       const occasion = (roomPrice.occasionPrices || []).find(occ => {
//         const start = moment(occ.startDate).startOf('day');
//         const end = moment(occ.endDate).endOf('day');
//         return today.isSameOrAfter(start) && today.isSameOrBefore(end);
//       });

//       if (occasion) {
//         finalPrice = occasion.price;
//         priceSource = 'Occasion Price';
//       } else if (
//         roomPrice.dayWisePrices &&
//         typeof roomPrice.dayWisePrices === 'object' &&
//         (
//           // Map may be serialized as Object in lean queries
//           (roomPrice.dayWisePrices.get && roomPrice.dayWisePrices.get(dayName) !== undefined)
//           || roomPrice.dayWisePrices[dayName] !== undefined
//         )
//       ) {
//         // .get for Map, [dayName] for Object
//         finalPrice = roomPrice.dayWisePrices.get
//           ? roomPrice.dayWisePrices.get(dayName)
//           : roomPrice.dayWisePrices[dayName];
//         priceSource = 'Daywise Price';
//       } else {
//         finalPrice = roomPrice.basePrice;
//         priceSource = 'Base Price';
//       }

//       return {
//         ...roomPrice,
//         finalPrice,
//         priceSource,
//       };
//     });

//     // Respond with all fully populated rooms and their prices
//     // res.json({
//     //   success: true,
//     //   count: results.length,
//     //   rooms: results
//     // });
//     // If you want to render a page instead, use:
//     res.render('Host/rooms', { properties: results });
//   } catch (error) {
//     console.error('Error fetching room prices by user:', error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// };













 };


// Helper: find occasion, if any, for a date
function findOccasion(occasions, date) {
  if (!occasions) return null;
  return occasions.find(o =>
    new Date(o.startDate) <= date && new Date(o.endDate) >= date
  );
}

// Helper: build calendar for a room for ALL DATES in the next 10 years
function buildRoomCalendarFor10Years({ basePrice, occasionPrices = [], discount = {}, servicerate, fromYear, toYear }) {
  const allDays = [];
  for (let year = fromYear; year <= toYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const numDays = new Date(year, month, 0).getDate();
      for (let day = 1; day <= numDays; day++) {
        const date = new Date(year, month - 1, day);
        let price = basePrice || 0;
        let occasion = findOccasion(occasionPrices, date);
        if (occasion) price = occasion.price;
        // Platform and host fee
        const platformFee = (price * servicerate) / 100;
        const hostGets = price - platformFee;
        // Discount logic (for display/demo)
        let discountedPrice = null, discPlatformFee = null, discHostGets = null;
        if (discount && discount.isActive && discount.percentage > 0) {
          discountedPrice = price * (1 - discount.percentage / 100);
          discPlatformFee = (discountedPrice * servicerate) / 100;
          discHostGets = discountedPrice - discPlatformFee;
        }
        allDays.push({
          date: date.toISOString().substring(0, 10),
          price,
          platformFee,
          hostGets,
          occasion: occasion ? occasion.name : null,
          discountedPrice,
          discPlatformFee,
          discHostGets,
        });
      }
    }
  }
  return allDays;
}
 const getRoomCalendars = async (propertyId, fromDate, toDate, servicerate) => {
  const prices = await RoomPrice.find({ propertyId });
  const calendars = {};
  for (const price of prices) {
    const cal = [];
    let current = moment(fromDate);
    const end = moment(toDate);
    while (current.isSameOrBefore(end, "day")) {
      const dayName = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][current.day()];
      // 1. Occasion
      let occ = price.occasionPrices && price.occasionPrices.find(o =>
        current.isSameOrAfter(moment(o.startDate), 'day') &&
        current.isSameOrBefore(moment(o.endDate), 'day')
      );
      if (occ) {
        cal.push({
          date: current.format("YYYY-MM-DD"),
          price: occ.price,
          occasion: occ.name,
          platformFee: occ.price * servicerate / 100,
          hostGets: occ.price - occ.price * servicerate / 100
        });
      } else if (price.dayWisePrices && (price.dayWisePrices.get ? price.dayWisePrices.get(dayName) : price.dayWisePrices[dayName])) {
        // .get(dayName) for Map, [dayName] for plain object
        let p = price.dayWisePrices.get ? price.dayWisePrices.get(dayName) : price.dayWisePrices[dayName];
        cal.push({
          date: current.format("YYYY-MM-DD"),
          price: p,
          dayWise: dayName,
          platformFee: p * servicerate / 100,
          hostGets: p - p * servicerate / 100
        });
      } else {
        let p = price.basePrice;
        cal.push({
          date: current.format("YYYY-MM-DD"),
          price: p,
          platformFee: p * servicerate / 100,
          hostGets: p - p * servicerate / 100
        });
      }
      current.add(1, "day");
    }
    calendars[price.roomId] = cal;
  }
  return calendars;
};
module.exports = new pagescontroller();