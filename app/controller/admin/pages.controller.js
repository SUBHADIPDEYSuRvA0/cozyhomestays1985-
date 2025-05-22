const category = require("../../models/category");
const aminities = require("../../models/aminities");
const gst = require("../../models/gst");
const service = require("../../models/service");
const serviceHost = require("../../models/service.host");
const propertyfullprice = require("../../models/propertyfullprice");
const RoomPrice = require("../../models/propertyroomprice");
const User = require("../../models/user");
const moment = require("moment");
const propertyaddress = require("../../models/propertyaddress");
const ListingType = require("../../models/propertylisttype");
const property = require("../../models/property");
const documentation = require("../../models/documentation");
const { default: mongoose } = require("mongoose");


class pagesController {
    login(req, res) {
        res.render('Admin/login');
    }
    index(req, res) {
        res.render('Admin/index');
    }
    category=async(req, res) => {
        const categories = await category.find();
        res.render('Admin/category',{categories});
    }

    aminiti=async(req, res)=> {
        const aminity =  await aminities.find();
        res.render('Admin/aminities',{aminity});
    }
    gst=async(req, res)=> {
        const allGsts = await gst.find();
        res.render('Admin/gst',{allGsts});
    }

    service=async(req, res)=> {
        const services = await service.findOne();
        res.render('Admin/service',{services});
    }

    servicehost=async(req, res)=> {
        const services = await serviceHost.findOne();

        res.render('Admin/servicehost',{services});
    }

    map(req, res) {
        const addresses = [
    "Gurugram, Haryana",
  ];
        res.render('Admin/map', { addresses });
    }


// allpropertiesandrooms = async (req, res) => {
//   try {
//     const currentDate = new Date();
//     const currentDay = moment(currentDate).format('dddd');
//     const currentDateOnly = moment(currentDate).format('YYYY-MM-DD');
//     const currentUTC = moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss');
//     const userLogin = req.user?.username || 'Guest';

//     // Get search params
//     const locationQuery = req.query.location?.trim();
//     const checkInDate = req.query.checkInDate;
//     const checkOutDate = req.query.checkOutDate;
//     const adults = req.query.adults;
//     const children = req.query.children;
//     const roomsCount = req.query.rooms;
//     const withPets = req.query.withPets === 'true';

//     // Build address match filter for your schema
//     const addressMatch = locationQuery
//       ? {
//           $or: [
//             { 'PropertyAddress.propertyName': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.city': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.fullAddress': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.mapAddress': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.state': { $regex: locationQuery, $options: 'i' } }
//           ]
//         }
//       : {};

//     // Helper to build aggregation pipeline for both models
//     function buildPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             from: 'propertyaddresses',
//             localField: 'PropertyAddress',
//             foreignField: '_id',
//             as: 'PropertyAddress'
//           }
//         },
//         { $unwind: '$PropertyAddress' }
//       ];
//       if (locationQuery) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     // Fetch properties and rooms with location filtering
//     const properties = await propertyfullprice.aggregate(buildPipeline());
//     const rooms = await RoomPrice.aggregate(buildPipeline());

//     // Helper to calculate final price
//     const calculateFinalPrice = (base, dayWise, occasions) => {
//       const occ = occasions?.find(o =>
//         moment(currentDateOnly).isBetween(moment(o.startDate).format('YYYY-MM-DD'), moment(o.endDate).format('YYYY-MM-DD'), null, '[]')
//       );
//       if (occ) return occ.price;
//       if (dayWise?.[currentDay] != null) return dayWise[currentDay];
//       return base;
//     };

//     // Process properties
//     const propertyItems = properties.map(p => {
//       const finalPrice = calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []);
//       return {
//         ...p,
//         type: 'property',
//         cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
//         cardPrice: finalPrice,
//         finalPrice,
//         cardImages: p.fullproperty?.mediaInput || [],
//         priceDetails: {
//           base: p.fullprice,
//           dayWise: p.dayWisePrices || {},
//           occasions: p.occationprice || [],
//           discount: p.discount
//         }
//       };
//     });

//     // Process rooms
//     const roomItems = rooms.map(r => {
//       const finalPrice = calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []);
//       return {
//         ...r,
//         type: 'room',
//         cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
//         cardPrice: finalPrice,
//         finalPrice,
//         cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
//         priceDetails: {
//           base: r.basePrice,
//           dayWise: r.dayWisePrices || {},
//           occasions: r.occasionPrices || [],
//           discount: r.discount
//         }
//       };
//     });

//     const items = [...propertyItems, ...roomItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     res.render('Admin/allproperties', {
//       items,
//       currentUTC,
//       userLogin,
//       moment,
//       locationQuery,
//       checkInDate,
//       checkOutDate,
//       adults,
//       children,
//       rooms: roomsCount,
//       withPets
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Server Error');
//   }
// };









// // allpropertiesandrooms = async (req, res) => {
// //   try {
// //     const locationQuery = req.query.location ? req.query.location.trim() : '';

// //     // Parse location for city and state if present
// //     let city = '', state = '';
// //     if (locationQuery) {
// //       const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
// //       city = parts[0] || '';
// //       state = parts[1] || '';
// //     }

// //     // Build address match filter
// //     let addressMatch = null;
// //     if (city && state) {
// //       // Both city and state provided
// //       addressMatch = {
// //         $and: [
// //           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
// //           { 'PropertyAddress.state': { $regex: state, $options: 'i' } }
// //         ]
// //       };
// //     } else if (city) {
// //       // Only city (or one part) provided, match either city or state
// //       addressMatch = {
// //         $or: [
// //           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
// //           { 'PropertyAddress.state': { $regex: city, $options: 'i' } }
// //         ]
// //       };
// //     }

// //     function buildPipeline() {
// //       const pipeline = [
// //         {
// //           $lookup: {
// //             from: 'propertyaddresses',
// //             localField: 'PropertyAddress',
// //             foreignField: '_id',
// //             as: 'PropertyAddress'
// //           }
// //         },
// //         { $unwind: '$PropertyAddress' }
// //       ];
// //       if (addressMatch) pipeline.push({ $match: addressMatch });
// //       return pipeline;
// //     }

// //     const properties = await propertyfullprice.aggregate(buildPipeline());
// //     const rooms = await RoomPrice.aggregate(buildPipeline());

// //     const calculateFinalPrice = (base, dayWise, occasions) => {
// //       const currentDay = moment().format('dddd');
// //       const currentDateOnly = moment().format('YYYY-MM-DD');
// //       const occ = occasions?.find(o =>
// //         moment(currentDateOnly).isBetween(
// //           moment(o.startDate).format('YYYY-MM-DD'),
// //           moment(o.endDate).format('YYYY-MM-DD'),
// //           null,
// //           '[]'
// //         )
// //       );
// //       if (occ) return occ.price;
// //       if (dayWise?.[currentDay] != null) return dayWise[currentDay];
// //       return base;
// //     };

// //     const propertyItems = properties.map(p => ({
// //       ...p,
// //       type: 'property',
// //       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
// //       cardPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
// //       finalPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
// //       cardImages: p.fullproperty?.mediaInput || [],
// //       priceDetails: {
// //         base: p.fullprice,
// //         dayWise: p.dayWisePrices || {},
// //         occasions: p.occationprice || [],
// //         discount: p.discount
// //       },
// //       PropertyAddress: p.PropertyAddress,
// //     }));

// //     const roomItems = rooms.map(r => ({
// //       ...r,
// //       type: 'room',
// //       cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
// //       cardPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
// //       finalPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
// //       cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
// //       priceDetails: {
// //         base: r.basePrice,
// //         dayWise: r.dayWisePrices || {},
// //         occasions: r.occasionPrices || [],
// //         discount: r.discount
// //       },
// //       PropertyAddress: r.PropertyAddress,
// //     }));

// //     const items = [...propertyItems, ...roomItems].sort(
// //       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //     );


// //     for (const item of items) {
// //       item.finalPrice = calculateFinalPrice(item.priceDetails.base, item.priceDetails.dayWise, item.priceDetails.occasions);
// //       console.log("Items:", items.finalPrice);
// //     }

    

// //     res.render('Admin/allproperties', {
// //       items,
// //       locationQuery,
// //       checkInDate: req.query.checkInDate,
// //       checkOutDate: req.query.checkOutDate,
// //       adults: req.query.adults,
// //       children: req.query.children,
// //       rooms: req.query.rooms,
// //       withPets: req.query.withPets === 'true',
// //       userLogin: req.user?.username || 'Guest',
// //       moment,
// //       currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss')
// //     });

// //   } catch (error) {
// //     console.error('Error:', error);
// //     res.status(500).send('Server Error');
// //   }
// // };




// allpropertiesandrooms = async (req, res) => {
//   try {
//     const locationQuery = req.query.location ? req.query.location.trim() : '';
//     let city = '', state = '';
//     if (locationQuery) {
//       const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
//       city = parts[0] || '';
//       state = parts[1] || '';
//     }

//     let addressMatch = null;
//     if (city && state) {
//       addressMatch = {
//         $and: [
//           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
//           { 'PropertyAddress.state': { $regex: state, $options: 'i' } }
//         ]
//       };
//     } else if (city) {
//       addressMatch = {
//         $or: [
//           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
//           { 'PropertyAddress.state': { $regex: city, $options: 'i' } }
//         ]
//       };
//     }

//     function buildPropertyPipeline() {
//       const pipeline = [
//         {
//           $lookup: { // Join PropertyAddress
//             from: 'propertyaddresses',
//             localField: 'PropertyAddress',
//             foreignField: '_id',
//             as: 'PropertyAddress'
//           }
//         },
//         { $unwind: '$PropertyAddress' },
//         {
//           $lookup: { // Join fullproperty for images
//             from: 'fullproperties',
//             localField: 'fullproperty',
//             foreignField: '_id',
//             as: 'fullproperty'
//           }
//         },
//         { $unwind: { path: '$fullproperty', preserveNullAndEmptyArrays: true } }
//       ];
//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     function buildRoomPipeline() {
//       const pipeline = [
//         {
//           $lookup: { // Join PropertyAddress
//             from: 'propertyaddresses',
//             localField: 'PropertyAddress',
//             foreignField: '_id',
//             as: 'PropertyAddress'
//           }
//         },
//         { $unwind: '$PropertyAddress' },
//         {
//           $lookup: { // Join roomId for room-specific images
//             from: 'rooms',
//             localField: 'roomId',
//             foreignField: '_id',
//             as: 'roomId'
//           }
//         },
//         { $unwind: { path: '$roomId', preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: { // Join fullproperty for fallback images
//             from: 'fullproperties',
//             localField: 'propertyId', // Adjust this if your RoomPrice uses propertyId or fullproperty id
//             foreignField: '_id',
//             as: 'fullproperty'
//           }
//         },
//         { $unwind: { path: '$fullproperty', preserveNullAndEmptyArrays: true } }
//       ];
//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     const properties = await propertyfullprice.aggregate(buildPropertyPipeline());
//     const rooms = await RoomPrice.aggregate(buildRoomPipeline());

//     // Map property items
//     const propertyItems = properties.map(p => ({
//       ...p,
//       type: 'property',
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: p.fullprice,
//         dayWisePrices: p.dayWisePrices,
//         occasionPrices: p.occationprice || []
//       }),
//       cardImages: p.fullproperty?.mediaInput || [],
//       priceDetails: {
//         base: p.fullprice,
//         dayWise: p.dayWisePrices || {},
//         occasions: p.occationprice || [],
//         discount: p.discount
//       },
//       PropertyAddress: p.PropertyAddress,
//     }));
// console.log('Rooms:', rooms);

//     // Map room items
//     const roomItems = rooms.map(r => ({
//       ...r,
//       type: 'room',
//       cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || []
//       }),
//       cardImages: [
//         ...(r.roomId?.mediaInput || []),
//         ...(r.fullproperty?.mediaInput || [])
//       ],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount
//       },
//       PropertyAddress: r.PropertyAddress,
//     }));

//     // Merge and sort
//     const items = [...propertyItems, ...roomItems].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     res.render('Admin/allproperties', {
//       items,
//       locationQuery,
//       checkInDate: req.query.checkInDate,
//       checkOutDate: req.query.checkOutDate,
//       adults: req.query.adults,
//       children: req.query.children,
//       rooms: req.query.rooms,
//       withPets: req.query.withPets === 'true',
//       userLogin: req.user?.username || 'Guest',
//       moment,
//       currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss')
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Server Error');
//   }
// };




allpropertiesandrooms= async (req, res) => {
    try {
      // Get all filter parameters from query
      const {
        location,
        search,
        minPrice,
        maxPrice,
        propertyType,
        status,
        checkInDate,
        checkOutDate,
        adults,
        children,
        rooms: roomCount,
        withPets,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query

      // Process location filter
      let city = "",
        state = ""
      if (location) {
        const parts = location
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean)
        city = parts[0] || ""
        state = parts[1] || ""
      }

      // Build address filter
      let addressFilter = {}
      if (city && state) {
        addressFilter = {
          city: { $regex: city, $options: "i" },
          state: { $regex: state, $options: "i" },
        }
      } else if (city) {
        addressFilter = {
          $or: [{ city: { $regex: city, $options: "i" } }, { state: { $regex: city, $options: "i" } }],
        }
      }

      // Get matching address IDs if address filter is applied
      let addressIds = []
      if (Object.keys(addressFilter).length > 0) {
        const matchingAddresses = await propertyaddress.find(addressFilter).select("_id")
        addressIds = matchingAddresses.map((addr) => addr._id)
      }

      // Build property query
      let propertyQuery = propertyfullprice.find()

      // Apply address filter if available
      if (addressIds.length > 0) {
        propertyQuery = propertyQuery.where("PropertyAddress").in(addressIds)
      }

      // Apply price filter if available
      if (minPrice) {
        propertyQuery = propertyQuery.where("fullprice").gte(Number(minPrice))
      }
      if (maxPrice) {
        propertyQuery = propertyQuery.where("fullprice").lte(Number(maxPrice))
      }

      // Apply property type filter if available
      if (propertyType) {
        const listingTypes = await ListingType.find({ listingType: propertyType }).select("_id")
        const listingTypeIds = listingTypes.map((lt) => lt._id)
        propertyQuery = propertyQuery.where("propertyListingType").in(listingTypeIds)
      }

      // Apply status filter if available (via user status)
      if (status) {
        const users = await User.find({ status }).select("_id")
        const userIds = users.map((user) => user._id)
        propertyQuery = propertyQuery.where("userId").in(userIds)
      }

      // Populate related data - Include all related data to avoid additional API calls
      propertyQuery = propertyQuery
        .populate({
          path: "PropertyAddress",
          model: "PropertyAddress",
        })
        .populate({
          path: "fullproperty",
          model: "fullproperty",
        })
        .populate({
          path: "userId",
          model: "User",
        })
        .populate({
          path: "propertycategory",
          model: "PropertyCategory",
        })
        .populate({
          path: "propertyListingType",
          model: "ListingType",
        })
        .populate({
          path: "PropertyPolicy",
          model: "PropertyPolicy",
        })
        .populate({
          path: "propertyaminities",
          model: "PropertyAminity",
        })
        .lean()

      // Execute property query
      const properties = await propertyQuery.exec()

      // Get all user IDs from properties
      const userIds = properties.map((p) => p.userId?._id).filter(Boolean)

      // Fetch document verification data for all users
      const documentVerifications = await documentation.find({
        userId: { $in: userIds },
      }).lean()

      // Create a map of user IDs to document verification data
      const docVerificationMap = documentVerifications.reduce((map, doc) => {
        map[doc.userId.toString()] = doc
        return map
      }, {})

      // Map property items with complete data
     const propertyItems = properties.map((p) => {
  // Get document verification for this property's user
  const userDocVerification = p.userId?.id ? docVerificationMap[p.userId.id.toString()] : null

  // Calculate final price
  const finalPrice = calculateFinalPrice({
    basePrice: p.fullprice,
    dayWisePrices: p.dayWisePrices,
    occasionPrices: p.occationprice || [],
  })

  // Create a complete property object with all data
  return {
    propertyId: p.propertyId,
    type: "property",
    cardTitle: p.PropertyAddress?.propertyName || "No Name",
    finalPrice: finalPrice,
    cardImages: p.fullproperty?.mediaInput || [],
    priceDetails: {
      base: p.fullprice,
      dayWise: p.dayWisePrices || {},
      occasions: p.occationprice || [],
      discount: p.discount,
    },
    PropertyAddress: p.PropertyAddress,
    user: p.userId || null,
    userDocVerification: userDocVerification || null,
    category: p.propertycategory?.title || "Uncategorized",
    listingType: p.propertyListingType?.listingType || "entireProperty",
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    fullproperty: p.fullproperty,
    cheakInTime: p.cheakInTime,
    cheakOutTime: p.cheakOutTime,
    propertyaminities: p.propertyaminities,
    fullprice: p.fullprice,
    dayWisePrices: p.dayWisePrices,
    occationprice: p.occationprice,
    discount: p.discount,
  }
})

      // Apply text search filter if available
      let filteredItems = [...propertyItems]
      if (search) {
        const searchRegex = new RegExp(search, "i")
        filteredItems = filteredItems.filter(
          (item) =>
            searchRegex.test(item.cardTitle) ||
            searchRegex.test(item.PropertyAddress?.city) ||
            searchRegex.test(item.PropertyAddress?.state) ||
            searchRegex.test(item.PropertyAddress?.fullAddress) ||
            searchRegex.test(item.user?.name) ||
            searchRegex.test(item.category),
        )
      }

      // Sort items
      filteredItems.sort((a, b) => {
        if (sortBy === "price") {
          return sortOrder === "asc" ? a.finalPrice - b.finalPrice : b.finalPrice - a.finalPrice
        } else if (sortBy === "name") {
          return sortOrder === "asc" ? a.cardTitle.localeCompare(b.cardTitle) : b.cardTitle.localeCompare(a.cardTitle)
        } else {
          // Default sort by createdAt
          return sortOrder === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt)
        }
      })

      // Get categories for filter dropdown
      const categories = await property.find().distinct("title")

      // Get listing types for filter dropdown
      const listingTypes = [
        { value: "entireProperty", label: "Entire Property" },
        { value: "roomWise", label: "Room Wise" },
      ]

      // Get statistics
      const stats = {
        totalProperties: propertyItems.length,
        totalVerifiedOwners: documentVerifications.filter((doc) => doc.isVerified).length,
        totalOwners: new Set(propertyItems.map((p) => p.user?.id?.toString()).filter(Boolean)).size,
        totalValue: propertyItems.reduce((sum, item) => sum + item.finalPrice, 0),
      }

      // Check if this is an AJAX request
      if (req.xhr) {
        return res.json({
          success: true,
          items: filteredItems,
          stats,
        })
      }

      // Render the EJS template with data
      res.render("Admin/allproperties", {
        items: filteredItems,
        stats,
        categories,
        listingTypes,
        filters: {
          location,
          search,
          minPrice,
          maxPrice,
          propertyType,
          status,
          checkInDate,
          checkOutDate,
          adults,
          children,
          roomCount,
          withPets,
          sortBy,
          sortOrder,
        },
        userLogin: req.user?.username || "Guest",
        moment,
        currentUTC: moment().utc("+05:30").format("YYYY-MM-DD HH:mm:ss"),
      })
    } catch (error) {
      console.error("Error:", error)
      if (req.xhr) {
        return res.status(500).json({ success: false, error: "Server Error" })
      }
      res.status(500).send("Server Error")
    }
  }

  findPropertyById= async (req, res) => {
    try {
      const propertyId = req.params.propertyId;
      console.log("propertyId", propertyId);

      if (!propertyId) {
        return res.status(400).json({ success: false, error: "Property ID is required" });
      }

      const property = await propertyfullprice.findOne({ propertyId: propertyId })
        .populate("PropertyAddress")
        .populate("fullproperty")
        .populate("userId")
        .populate("propertycategory")
        .populate("propertyListingType")
        .populate("PropertyPolicy")
        .populate("propertyaminities")
        .lean();

      console.log("property", property);

      if (!property) {
        return res.status(404).json({ success: false, error: "Property not found" });
      }

      // Get document verification for this property's user
      let userDocVerification = null;
      if (property.userId && property.userId.id) {
        userDocVerification = await documentation.findOne({
          userId: property.userId.id,
        }).lean();
      }

      const propertyData = {
        ...property,
        type: "property",
        cardTitle: property.PropertyAddress?.propertyName || "No Name",
        finalPrice: calculateFinalPrice({
          basePrice: property.fullprice,
          dayWisePrices: property.dayWisePrices,
          occasionPrices: property.occationprice || [],
        }),
        cardImages: property.fullproperty?.mediaInput || [],
        priceDetails: {
          base: property.fullprice,
          dayWise: property.dayWisePrices || {},
          occasions: property.occationprice || [],
          discount: property.discount,
        },
        userDocVerification: userDocVerification || null,
        category: property.propertycategory?.title || "Uncategorized",
        listingType: property.propertyListingType?.listingType || "entireProperty",
      };

      return res.json({ success: true, property: propertyData });
    } catch (error) {
      console.error("Error finding property:", error);
      return res.status(500).json({ success: false, error: "Server Error" });
    }
  }
};
// Helper function to calculate final price
function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
  const today = moment().startOf("day")

  // 1. Check for occasion
  const occ =
    Array.isArray(occasionPrices) &&
    occasionPrices.find(
      (o) =>
        today.isSameOrAfter(moment(o.startDate).startOf("day")) && today.isSameOrBefore(moment(o.endDate).endOf("day")),
    )
  if (occ) return occ.price

  // 2. Check for daywise price
  const dayName = today.format("dddd")
  if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName]

  // 3. Fallback to base price
  return basePrice
}

  
// Helper function to calculate final price
// function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
//   const today = moment().startOf("day")

//   // 1. Check for occasion
//   const occ =
//     Array.isArray(occasionPrices) &&
//     occasionPrices.find(
//       (o) =>
//         today.isSameOrAfter(moment(o.startDate).startOf("day")) && today.isSameOrBefore(moment(o.endDate).endOf("day")),
//     )
//   if (occ) return occ.price

//   // 2. Check for daywise price
//   const dayName = today.format("dddd")
//   if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName]

//   // 3. Fallback to base price
//   return basePrice
// }


// Helper function to find property by ID



// Helper function to calculate final price
// function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
//   const today = moment().startOf('day');
  
//   // 1. Check for occasion
//   const occ = Array.isArray(occasionPrices) && occasionPrices.find(o =>
//     today.isSameOrAfter(moment(o.startDate).startOf('day')) &&
//     today.isSameOrBefore(moment(o.endDate).endOf('day'))
//   );
//   if (occ) return occ.price;

//   // 2. Check for daywise price
//   const dayName = today.format('dddd');
//   if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName];

//   // 3. Fallback to base price
//   return basePrice;
// }
// allpropertiesandrooms = async (req, res) => {
//   try {
//     // Get search parameters
//     const locationQuery = req.query.location ? req.query.location.trim() : "";
//     const searchQuery = req.query.search ? req.query.search.trim() : "";
//     let city = "",
//       state = "";

//     if (locationQuery) {
//       const parts = locationQuery
//         .split(",")
//         .map((p) => p.trim())
//         .filter(Boolean);
//       city = parts[0] || "";
//       state = parts[1] || "";
//     }

//     // Build address match condition for aggregation
//     let addressMatch = null;
//     if (city && state) {
//       addressMatch = {
//         $and: [
//           { "PropertyAddress.city": { $regex: city, $options: "i" } },
//           { "PropertyAddress.state": { $regex: state, $options: "i" } },
//         ],
//       };
//     } else if (city) {
//       addressMatch = {
//         $or: [
//           { "PropertyAddress.city": { $regex: city, $options: "i" } },
//           { "PropertyAddress.state": { $regex: city, $options: "i" } },
//         ],
//       };
//     }

//     // Search query match condition
//     let searchMatch = null;
//     if (searchQuery) {
//       searchMatch = {
//         $or: [
//           { "PropertyAddress.propertyName": { $regex: searchQuery, $options: "i" } },
//           { "PropertyAddress.city": { $regex: searchQuery, $options: "i" } },
//           { "PropertyAddress.state": { $regex: searchQuery, $options: "i" } },
//         ],
//       };
//     }

//     // Build aggregation pipelines
//     function buildPropertyPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             // Join PropertyAddress
//             from: "propertyaddresses",
//             localField: "PropertyAddress",
//             foreignField: "_id",
//             as: "PropertyAddress",
//           },
//         },
//         { $unwind: "$PropertyAddress" },
//         {
//           $lookup: {
//             // Join fullproperty for images
//             from: "fullproperties",
//             localField: "fullproperty",
//             foreignField: "_id",
//             as: "fullproperty",
//           },
//         },
//         { $unwind: { path: "$fullproperty", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join user data
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       ];

//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       if (searchMatch) pipeline.push({ $match: searchMatch });

//       return pipeline;
//     }

//     function buildRoomPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             // Join PropertyAddress
//             from: "propertyaddresses",
//             localField: "PropertyAddress",
//             foreignField: "_id",
//             as: "PropertyAddress",
//           },
//         },
//         { $unwind: "$PropertyAddress" },
//         {
//           $lookup: {
//             // Join roomId for room-specific images
//             from: "rooms",
//             localField: "roomId",
//             foreignField: "_id",
//             as: "roomId",
//           },
//         },
//         { $unwind: { path: "$roomId", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join fullproperty for fallback images
//             from: "fullproperties",
//             localField: "fullproperty",
//             foreignField: "_id",
//             as: "fullproperty",
//           },
//         },
//         { $unwind: { path: "$fullproperty", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join user data
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       ];

//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       if (searchMatch) pipeline.push({ $match: searchMatch });

//       return pipeline;
//     }

//     // Execute aggregations
//     const properties = await propertyfullprice.aggregate(buildPropertyPipeline());
//     const rooms = await RoomPrice.aggregate(buildRoomPipeline());

//     // Get all users for admin functions
//     const users = await User.find({}, "name email role status");

//     // Map property items
//     const propertyItems = properties.map((p) => ({
//       ...p,
//       type: "property",
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || "No Name",
//       finalPrice: calculateFinalPrice({
//         basePrice: p.fullprice,
//         dayWisePrices: p.dayWisePrices,
//         occasionPrices: p.occationprice || [],
//       }),
//       cardImages: p.fullproperty?.mediaInput || [],
//       priceDetails: {
//         base: p.fullprice,
//         dayWise: p.dayWisePrices || {},
//         occasions: p.occationprice || [],
//         discount: p.discount,
//       },
//       PropertyAddress: p.PropertyAddress,
//       user: {
//         name: p.user?.name || "Unknown",
//         email: p.user?.email || "No Email",
//         role: p.user?.role || "User",
//         status: p.user?.status || "Unknown",
//       },
//     }));

//     // Map room items
//     const roomItems = rooms.map((r) => ({
//       ...r,
//       type: "room",
//       cardTitle: r.roomId?.name || r.fullproperty?.name || "No Name",
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || [],
//       }),
//       cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount,
//       },
//       PropertyAddress: r.PropertyAddress,
//       user: {
//         name: r.user?.name || "Unknown",
//         email: r.user?.email || "No Email",
//         role: r.user?.role || "User",
//         status: r.user?.status || "Unknown",
//       },
//     }));

//     // Merge and sort
//     const items = [...propertyItems, ...roomItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//     // Check if this is an AJAX request
//     if (req.xhr) {
//       return res.json({
//         items,
//         success: true,
//       });
//     }

//     // Regular page render
//     res.render("Admin/allproperties", {
//       items,
//       users,
//       locationQuery,
//       searchQuery,
//       checkInDate: req.query.checkInDate,
//       checkOutDate: req.query.checkOutDate,
//       adults: req.query.adults,
//       children: req.query.children,
//       rooms: req.query.rooms,
//       withPets: req.query.withPets === "true",
//       userLogin: req.user?.username || "Guest",
//       moment,
//       currentUTC: moment().utc("+05:30").format("YYYY-MM-DD HH:mm:ss"),
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     if (req.xhr) {
//       return res.status(500).json({ success: false, error: "Server Error" });
//     }
//     res.status(500).send("Server Error");
//   }
// }
// allpropertiesandrooms = async (req, res) => {
//   try {
//     const locationQuery = req.query.location ? req.query.location.trim() : '';
//     let city = '', state = '';
//     if (locationQuery) {
//       const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
//       city = parts[0] || '';
//       state = parts[1] || '';
//     }

//     // Build address filter for population
//     let addressFilter = {};
//     if (city && state) {
//       addressFilter = {
//         city: { $regex: city, $options: 'i' },
//         state: { $regex: state, $options: 'i' }
//       };
//     } else if (city) {
//       addressFilter = {
//         $or: [
//           { city: { $regex: city, $options: 'i' } },
//           { state: { $regex: city, $options: 'i' } }
//         ]
//       };
//     }

//     // --- Properties (entire property listings) ---
//     let propertyQuery = propertyfullprice.find();
//     if (Object.keys(addressFilter).length > 0) {
//       const matchingAddresses = await propertyaddress.find(addressFilter).select('_id');
//       const addressIds = matchingAddresses.map(addr => addr._id);
//       propertyQuery = propertyQuery.where('PropertyAddress').in(addressIds);
//     }
//     propertyQuery = propertyQuery
//       .populate({
//         path: 'PropertyAddress',
//         model: 'PropertyAddress'
//       })
//       .populate({
//         path: 'fullproperty',
//         model: 'fullproperty'
//       });

//     const properties = await propertyQuery.exec();

//     // --- Rooms (room-wise listings) ---
//     let roomQuery = RoomPrice.find();
//     if (Object.keys(addressFilter).length > 0) {
//       const matchingAddresses = await propertyaddress.find(addressFilter).select('_id');
//       const addressIds = matchingAddresses.map(addr => addr._id);
//       roomQuery = roomQuery.where('PropertyAddress').in(addressIds);
//     }
//     roomQuery = roomQuery
//       .populate({
//         path: 'roomId',
//         model: 'Room'
//       })
//       .populate({
//         path: 'fullproperty',
//         model: 'fullproperty'
//       })
//       .populate({
//         path: 'PropertyAddress',
//         model: 'PropertyAddress'
//       });

//     const rooms = await roomQuery.exec();

//     // Map property items
//     const propertyItems = properties.map(p => ({
//       ...p._doc,
//       type: 'property',
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: p.fullprice,
//         dayWisePrices: p.dayWisePrices,
//         occasionPrices: p.occationprice || []
//       }),
//       cardImages: p.fullproperty?.mediaInput || [],
//       priceDetails: {
//         base: p.fullprice,
//         dayWise: p.dayWisePrices || {},
//         occasions: p.occationprice || [],
//         discount: p.discount
//       },
//       PropertyAddress: p.PropertyAddress,
//     }));

//     // Map room items
//     const roomItems = rooms.map(r => ({
//       ...r._doc,
//       type: 'room',
//       cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || []
//       }),
//       cardImages: [
//         ...(r.roomId?.mediaInput || []),
//         ...(r.fullproperty?.mediaInput || [])
//       ],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount
//       },
//       PropertyAddress: r.PropertyAddress,
//     }));

//     // Merge and sort
//     const items = [...propertyItems, ...roomItems].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     res.render('Admin/allproperties', {
//       items,
//       locationQuery,
//       checkInDate: req.query.checkInDate,
//       checkOutDate: req.query.checkOutDate,
//       adults: req.query.adults,
//       children: req.query.children,
//       rooms: req.query.rooms,
//       withPets: req.query.withPets === 'true',
//       userLogin: req.user?.username || 'Guest',
//       moment,
//       currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss')
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Server Error');
//   }
// };
// allpropertiesandrooms = async (req, res) => {
//   try {
//     const locationQuery = req.query.location ? req.query.location.trim() : '';
//     let city = '', state = '';
//     if (locationQuery) {
//       const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
//       city = parts[0] || '';
//       state = parts[1] || '';
//     }

//     let addressMatch = null;
//     if (city && state) {
//       addressMatch = {
//         $and: [
//           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
//           { 'PropertyAddress.state': { $regex: state, $options: 'i' } }
//         ]
//       };
//     } else if (city) {
//       addressMatch = {
//         $or: [
//           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
//           { 'PropertyAddress.state': { $regex: city, $options: 'i' } }
//         ]
//       };
//     }

//     // Pipeline for full property prices (entire property listing)
//     function buildPropertyPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             from: 'propertyaddresses',
//             localField: 'PropertyAddress',
//             foreignField: '_id',
//             as: 'PropertyAddress'
//           }
//         },
//         { $unwind: '$PropertyAddress' },
//         {
//           $lookup: {
//             from: 'fullproperties',
//             localField: 'fullproperty',
//             foreignField: '_id',
//             as: 'fullproperty'
//           }
//         },
//         { $unwind: { path: '$fullproperty', preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'userId',
//             foreignField: '_id',
//             as: 'user'
//           }
//         },
//         { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
//       ];
//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     // Pipeline for room prices (room-wise listing)
//     function buildRoomPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             from: 'propertyaddresses',
//             localField: 'PropertyAddress',
//             foreignField: '_id',
//             as: 'PropertyAddress'
//           }
//         },
//         { $unwind: '$PropertyAddress' },
//         {
//           $lookup: {
//             from: 'rooms',
//             localField: 'roomId',
//             foreignField: '_id',
//             as: 'roomId'
//           }
//         },
//         { $unwind: { path: '$roomId', preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             from: 'fullproperties',
//             localField: 'propertyId',
//             foreignField: '_id',
//             as: 'fullproperty'
//           }
//         },
//         { $unwind: { path: '$fullproperty', preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             from: 'users',
//             localField: 'userId',
//             foreignField: '_id',
//             as: 'user'
//           }
//         },
//         { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
//       ];
//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     const properties = await propertyfullprice.aggregate(buildPropertyPipeline());
//     const rooms = await RoomPrice.aggregate(buildRoomPipeline());

//     // Map property items
//     const propertyItems = properties.map(p => ({
//       type: 'property',
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: p.fullprice,
//         dayWisePrices: p.dayWisePrices,
//         occasionPrices: p.occationprice || []
//       }),
//       cardImages: p.fullproperty?.mediaInput || [],
//       priceDetails: {
//         base: p.fullprice,
//         dayWise: p.dayWisePrices || {},
//         occasions: p.occationprice || [],
//         discount: p.discount
//       },
//       PropertyAddress: p.PropertyAddress,
//       user: p.user,
//       createdAt: p.createdAt,
//       updatedAt: p.updatedAt
//     }));

//     // Map room items
//     const roomItems = rooms.map(r => ({
//       type: 'room',
//       cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || []
//       }),
//       cardImages: [
//         ...(r.roomId?.mediaInput || []),
//         ...(r.fullproperty?.mediaInput || [])
//       ],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount
//       },
//       PropertyAddress: r.PropertyAddress,
//       user: r.user,
//       createdAt: r.createdAt,
//       updatedAt: r.updatedAt
//     }));

//     // Merge and sort
//     const items = [...propertyItems, ...roomItems].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     res.render('Admin/allproperties', {
//       items,
//       locationQuery,
//       checkInDate: req.query.checkInDate,
//       checkOutDate: req.query.checkOutDate,
//       adults: req.query.adults,
//       children: req.query.children,
//       rooms: req.query.rooms,
//       withPets: req.query.withPets === 'true',
//       userLogin: req.user?.username || 'Guest',
//       moment,
//       currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss')
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Server Error');
//   }
// };


    // Helper function to get price for a specific date
   
// function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
//   const today = moment().startOf('day');
//   // 1. Check for occasion
//   const occ = Array.isArray(occasionPrices) && occasionPrices.find(o =>
//     today.isSameOrAfter(moment(o.startDate).startOf('day')) &&
//     today.isSameOrBefore(moment(o.endDate).endOf('day'))
//   );
//   if (occ) return occ.price;

//   // 2. Check for daywise price
//   const dayName = today.format('dddd');
//   if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName];

//   // 3. Fallback to base price
//   return basePrice;
// }




// allpropertiesandrooms = async (req, res) => {
//   try {
//     // Get search parameters
//     const locationQuery = req.query.location ? req.query.location.trim() : ""
//     const searchQuery = req.query.search ? req.query.search.trim() : ""
//     let city = "",
//       state = ""

//     if (locationQuery) {
//       const parts = locationQuery
//         .split(",")
//         .map((p) => p.trim())
//         .filter(Boolean)
//       city = parts[0] || ""
//       state = parts[1] || ""
//     }

//     // Build address match condition for aggregation
//     let addressMatch = null
//     if (city && state) {
//       addressMatch = {
//         $and: [
//           { "PropertyAddress.city": { $regex: city, $options: "i" } },
//           { "PropertyAddress.state": { $regex: state, $options: "i" } },
//         ],
//       }
//     } else if (city) {
//       addressMatch = {
//         $or: [
//           { "PropertyAddress.city": { $regex: city, $options: "i" } },
//           { "PropertyAddress.state": { $regex: city, $options: "i" } },
//         ],
//       }
//     }

//     // Search query match condition
//     let searchMatch = null
//     if (searchQuery) {
//       searchMatch = {
//         $or: [
//           { "PropertyAddress.propertyName": { $regex: searchQuery, $options: "i" } },
//           { "PropertyAddress.city": { $regex: searchQuery, $options: "i" } },
//           { "PropertyAddress.state": { $regex: searchQuery, $options: "i" } },
//         ],
//       }
//     }

//     // Build aggregation pipelines
//     function buildPropertyPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             // Join PropertyAddress
//             from: "propertyaddresses",
//             localField: "PropertyAddress",
//             foreignField: "_id",
//             as: "PropertyAddress",
//           },
//         },
//         { $unwind: "$PropertyAddress" },
//         {
//           $lookup: {
//             // Join fullproperty for images
//             from: "fullproperties",
//             localField: "fullproperty",
//             foreignField: "_id",
//             as: "fullproperty",
//           },
//         },
//         { $unwind: { path: "$fullproperty", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join user data
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       ]

//       if (addressMatch) pipeline.push({ $match: addressMatch })
//       if (searchMatch) pipeline.push({ $match: searchMatch })

//       return pipeline
//     }

//     function buildRoomPipeline() {
//       const pipeline = [
//         {
//           $lookup: {
//             // Join PropertyAddress
//             from: "propertyaddresses",
//             localField: "PropertyAddress",
//             foreignField: "_id",
//             as: "PropertyAddress",
//           },
//         },
//         { $unwind: "$PropertyAddress" },
//         {
//           $lookup: {
//             // Join roomId for room-specific images
//             from: "rooms",
//             localField: "roomId",
//             foreignField: "_id",
//             as: "roomId",
//           },
//         },
//         { $unwind: { path: "$roomId", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join fullproperty for fallback images
//             from: "fullproperties",
//             localField: "fullproperty",
//             foreignField: "_id",
//             as: "fullproperty",
//           },
//         },
//         { $unwind: { path: "$fullproperty", preserveNullAndEmptyArrays: true } },
//         {
//           $lookup: {
//             // Join user data
//             from: "users",
//             localField: "userId",
//             foreignField: "_id",
//             as: "user",
//           },
//         },
//         { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
//       ]

//       if (addressMatch) pipeline.push({ $match: addressMatch })
//       if (searchMatch) pipeline.push({ $match: searchMatch })

//       return pipeline
//     }

//     // Execute aggregations
//     const properties = await propertyfullprice.aggregate(buildPropertyPipeline())
//     const rooms = await RoomPrice.aggregate(buildRoomPipeline())

//     // Get all users for admin functions
//     const users = await User.find({}, "name email role status")

//     // Map property items
//     const propertyItems = properties.map((p) => ({
//       ...p,
//       type: "property",
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || "No Name",
//       finalPrice: calculateFinalPrice({
//         basePrice: p.fullprice,
//         dayWisePrices: p.dayWisePrices,
//         occasionPrices: p.occationprice || [],
//       }),
//       cardImages: p.fullproperty?.mediaInput || [],
//       priceDetails: {
//         base: p.fullprice,
//         dayWise: p.dayWisePrices || {},
//         occasions: p.occationprice || [],
//         discount: p.discount,
//       },
//       PropertyAddress: p.PropertyAddress,
//       user: {
//         name: p.user?.name || "Unknown",
//         email: p.user?.email || "No Email",
//         role: p.user?.role || "User",
//         status: p.user?.status || "Unknown",
//       },
//     }))

//     // Map room items
//     const roomItems = rooms.map((r) => ({
//       ...r,
//       type: "room",
//       cardTitle: r.roomId?.name || r.fullproperty?.name || "No Name",
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || [],
//       }),
//       cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount,
//       },
//       PropertyAddress: r.PropertyAddress,
//       user: {
//         name: r.user?.name || "Unknown",
//         email: r.user?.email || "No Email",
//         role: r.user?.role || "User",
//         status: r.user?.status || "Unknown",
//       },
//     }))

//     // Merge and sort
//     const items = [...propertyItems, ...roomItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

//     // Check if this is an AJAX request
//     if (req.xhr) {
//       return res.json({
//         items,
//         success: true,
//       })
//     }

//     // Regular page render
//     res.render("Admin/allproperties", {
//       items,
//       users,
//       locationQuery,
//       searchQuery,
//       checkInDate: req.query.checkInDate,
//       checkOutDate: req.query.checkOutDate,
//       adults: req.query.adults,
//       children: req.query.children,
//       rooms: req.query.rooms,
//       withPets: req.query.withPets === "true",
//       userLogin: req.user?.username || "Guest",
//       moment,
//       currentUTC: moment().utc("+05:30").format("YYYY-MM-DD HH:mm:ss"),
//     })
//   } catch (error) {
//     console.error("Error:", error)
//     if (req.xhr) {
//       return res.status(500).json({ success: false, error: "Server Error" })
//     }
//     res.status(500).send("Server Error")
//   }
// }
// }
// // Helper function to calculate final price
// function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
//   const today = moment().startOf("day")

//   // 1. Check for occasion
//   const occ =
//     Array.isArray(occasionPrices) &&
//     occasionPrices.find(
//       (o) =>
//         today.isSameOrAfter(moment(o.startDate).startOf("day")) && today.isSameOrBefore(moment(o.endDate).endOf("day")),
//     )
//   if (occ) return occ.price

//   // 2. Check for daywise price
//   const dayName = today.format("dddd")
//   if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName]

//   // 3. Fallback to base price
//   return basePrice
// }


module.exports = new pagesController();
