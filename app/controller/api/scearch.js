const propertyfullprice = require('../../models/propertyfullprice');
// const RoomPrice = require('../../models/propertyroomprice');
const moment = require('moment');
const property = require('../../models/property');
const propertyaddress = require('../../models/propertyaddress');
const propertyaminities = require('../../models/propertyaminities');
const propertypolicy = require('../../models/propertypolicy');
// const roomdetails = require('../../models/roomdetails');
const serviceHost = require('../../models/service.host');
const ListingType = require('../../models/propertylisttype');
const fullproperty = require('../../models/fullproperty');

class SearchController {

// getAllPropertiesWithAllModels = async (req, res) => {
//   try {
//     // Flexible search term
//     const {
//       location = "",
//       city = "",
//       state = "",
//       pincode = "",
//       propertyName = ""
//     } = req.query;

//     // ---- Fuzzy Address Filter ----
//     let addressFilter = {};
//     let searchTerms = [];

//     if (location) searchTerms.push(location);
//     if (city) searchTerms.push(city);
//     if (state) searchTerms.push(state);
//     if (pincode) searchTerms.push(pincode);
//     if (propertyName) searchTerms.push(propertyName);

//     // If searchTerms exist, build a $or array across all major address fields
//     if (searchTerms.length > 0) {
//       addressFilter.$or = searchTerms.flatMap(term => {
//         if (!term) return [];
//         return [
//           { propertyName: { $regex: term, $options: "i" } },
//           { city: { $regex: term, $options: "i" } },
//           { state: { $regex: term, $options: "i" } },
//           { pincode: { $regex: term, $options: "i" } },
//           { nearby: { $regex: term, $options: "i" } },
//           { mapAddress: { $regex: term, $options: "i" } },
//           { fullAddress: { $regex: term, $options: "i" } }
//         ];
//       });
//     }

//     // Find matching addresses and propertyIds
//     let addressIds = [];
//     let propertyIds = [];
//     if (Object.keys(addressFilter).length > 0) {
//       const addresses = await propertyaddress.find(addressFilter).select('_id propertyId');
//       addressIds = addresses.map(a => a._id);
//       propertyIds = addresses.map(a => a.propertyId);
//     }

//     // If no filter provided, get all unique propertyIds
//     if (!propertyIds.length && !Object.keys(addressFilter).length) {
//       const allAddresses = await propertyaddress.find({}).select('propertyId');
//       propertyIds = allAddresses.map(a => a.propertyId);
//     }
//     propertyIds = [...new Set(propertyIds)]; // unique

//     // For each propertyId, fetch all model data
//     const results = [];
//     for (const propertyId of propertyIds) {
//       // Fetch all related data for this propertyId
//       const [
//         fullPrices,
//         addresses,
//         categories,
//         policies,
//         aminities,
//         listingTypes,
//         fullproperties
//       ] = await Promise.all([
//         propertyfullprice.find({ propertyId })
//           .populate({ path: "PropertyAddress" })
//           .populate({ path: "propertycategory" })
//           .populate({ path: "PropertyPolicy" })
//           .populate({ path: "propertyaminities" })
//           .populate({ path: "listingType" })
//           .populate({ path: "fullproperty" })
//           .populate({ path: "userId", select: "name email" }),
//         propertyaddress.find({ propertyId }),
//         property.find({ propertyId }),
//         propertypolicy.find({ propertyId }),
//         propertyaminities.find({ propertyId }),
//         ListingType.find({ propertyId }),
//         fullproperty.find({ propertyId }),
//       ]);

//       results.push({
//         propertyId,
//         PropertyFullPrice: fullPrices,
//         PropertyAddress: addresses,
//         PropertyCategory: categories,
//         PropertyPolicy: policies,
//         PropertyAminity: aminities,
//         ListingType: listingTypes,
//         fullproperty: fullproperties,
//       });
//     }

//     res.json({
//       success: true,
//       total: results.length,
//       data: results
//     });
//   } catch (error) {
//     console.error('Property search error:', error);
//     res.status(500).json({ success: false, message: 'Server Error', error: error.message });
//   }
// };
searchAllProperties = async (req, res) => {
  try {
    let search = req.query.q?.trim().toLowerCase() || "";

    // Remove "near" or "nearby" and extra spaces, then pick the most likely location word
    search = search.replace(/^(nearby|near)\s*/i, "");

    // Optionally, remove generic words (add more as needed)
    const GENERIC_WORDS = ["lake", "hotel", "resort", "area", "road", "city", "village"];
    let keyword = search.split(" ")
      .filter(word => word && !GENERIC_WORDS.includes(word))
      .join(" ")
      .trim();

    // If nothing left, fall back to the original search
    if (!keyword) keyword = search;

    let addressFilter = {};
    if (keyword) {
      addressFilter = {
        $or: [
          { propertyName:   { $regex: keyword, $options: "i" } },
          { city:           { $regex: keyword, $options: "i" } },
          { state:          { $regex: keyword, $options: "i" } },
          { pincode:        { $regex: keyword, $options: "i" } },
          { nearby:         { $regex: keyword, $options: "i" } },
          { mapAddress:     { $regex: keyword, $options: "i" } },
          { fullAddress:    { $regex: keyword, $options: "i" } }
        ]
      };
    }

    const addresses = await propertyaddress.find(addressFilter).select('propertyId');
    let propertyIds = addresses.map(a => a.propertyId);

    if (!keyword) {
      const allAddresses = await propertyaddress.find({}).select('propertyId');
      propertyIds = allAddresses.map(a => a.propertyId);
    }
    propertyIds = [...new Set(propertyIds)];

    const results = await Promise.all(propertyIds.map(async (propertyId) => {
      const [
        fullPrices,
        addresses,
        categories,
        policies,
        aminities,
        listingTypes,
        fullproperties
      ] = await Promise.all([
        propertyfullprice.find({ propertyId }),
        propertyaddress.find({ propertyId }),
        property.find({ propertyId }),
        propertypolicy.find({ propertyId }),
        propertyaminities.find({ propertyId }),
        ListingType.find({ propertyId }),
        fullproperty.find({ propertyId }),
      ]);
      return {
        propertyId,
        PropertyFullPrice: fullPrices,
        PropertyAddress: addresses,
        PropertyCategory: categories,
        PropertyPolicy: policies,
        PropertyAminity: aminities,
        ListingType: listingTypes,
        fullproperty: fullproperties
      };
    }));

    res.json({
      success: true,
      total: results.length,
      data: results
    });
  } catch (error) {
    console.error('Property search error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};


// getAllPropertiesAndRooms = async (req, res) => {
// try {
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

//     // Properties (entire property listings)
//     let propertyQuery = propertyfullprice.find();
//     if (Object.keys(addressFilter).length > 0) {
//       // Filter by address
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

//     // Rooms (room-wise listings)
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

//     res.json({
//       success: true,
//       locationQuery,
//       total: items.length,
//       data: items
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };


//  getAllPropertiesAndRooms = async (req, res) => {
//   try {
//     const locationQuery = req.query.location ? req.query.location.trim() : '';
//     let city = '', state = '';

//     if (locationQuery) {
//       const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
//       city = parts[0] || '';
//       state = parts[1] || '';
//     }

//     let addressMatch = {};
//     if (city && state) {
//       addressMatch = {
//         'PropertyAddress.city': { $regex: city, $options: 'i' },
//         'PropertyAddress.state': { $regex: state, $options: 'i' },
//       };
//     } else if (city) {
//       addressMatch = {
//         $or: [
//           { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
//           { 'PropertyAddress.state': { $regex: city, $options: 'i' } },
//         ],
//       };
//     }

//     // Fetch properties
//     const propertyResults = await propertyfullprice.find()
//       .populate('PropertyAddress')
//       .populate('fullproperty')
//       .lean();

//     const filteredProperties = propertyResults.filter(p => {
//       const addr = p.PropertyAddress;
//       if (!addr) return false;
//       return (
//         (!city || new RegExp(city, 'i').test(addr.city)) &&
//         (!state || new RegExp(state, 'i').test(addr.state))
//       );
//     });

//     // Fetch room prices
//     const roomResults = await RoomPrice.find()
//       .populate('PropertyAddress')
//       .populate('roomId')
//       .populate('propertyId') // assuming propertyId = fullproperty
//       .lean();

//     const filteredRooms = roomResults.filter(r => {
//       const addr = r.PropertyAddress;
//       if (!addr) return false;
//       return (
//         (!city || new RegExp(city, 'i').test(addr.city)) &&
//         (!state || new RegExp(state, 'i').test(addr.state))
//       );
//     });

//     // Helper function
//     const calculateFinalPrice = ({ basePrice = 0, dayWisePrices = {}, occasionPrices = [] }) => {
//       // Example logic - customize as needed
//       return basePrice;
//     };

//     // Format properties
//     const propertyItems = filteredProperties.map(p => ({
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
//       PropertyAddress: p.PropertyAddress
//     }));

//     // Format rooms
//     const roomItems = filteredRooms.map(r => ({
//       ...r,
//       type: 'room',
//       cardTitle: r.roomId?.name || r.propertyId?.name || 'No Name',
//       finalPrice: calculateFinalPrice({
//         basePrice: r.basePrice,
//         dayWisePrices: r.dayWisePrices,
//         occasionPrices: r.occasionPrices || []
//       }),
//       cardImages: [
//         ...(r.roomId?.mediaInput || []),
//         ...(r.propertyId?.mediaInput || [])
//       ],
//       priceDetails: {
//         base: r.basePrice,
//         dayWise: r.dayWisePrices || {},
//         occasions: r.occasionPrices || [],
//         discount: r.discount
//       },
//       PropertyAddress: r.PropertyAddress
//     }));

//     const items = [...propertyItems, ...roomItems].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//     res.json({
//       success: true,
//       total: items.length,
//       location: locationQuery,
//       data: items
//     });

//   } catch (error) {
//     console.error('Error fetching properties/rooms:', error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// };
searchByAmenityIds = async (req, res) => {
  try {
    const { amenities } = req.query;

    if (!amenities) {
      return res.status(400).json({ success: false, message: 'Amenities query parameter is required.' });
    }

    const amenityIds = amenities.split(',').map(id => id.trim());

    // Helper to simplify amenity objects (remove __v and only keep useful fields)
    const simplifyAmenities = (amenities) =>
      amenities.map(a => ({
        id: a._id,
        title: a.title,
        icon: a.icon
      }));

    // Search in PropertyFullPrice
    const matchedProperties = await propertyfullprice.find()
      .populate({
        path: 'propertyaminities',
        populate: { path: 'amenities', model: 'Aminities' }
      })
      .populate('PropertyAddress')
      .populate('fullproperty')
      .lean();

    // Filter properties that have all requested amenities
    const filteredProperties = matchedProperties.filter(p => {
      const amenityRefs = p.propertyaminities?.amenities?.map(a => a._id.toString()) || [];
      return amenityIds.every(id => amenityRefs.includes(id));
    });

    // Search in RoomPrice
    const matchedRooms = await RoomPrice.find()
      .populate({
        path: 'propertyaminities',
        populate: { path: 'amenities', model: 'Aminities' }
      })
      .populate('PropertyAddress')
      .populate('roomId')
      .populate('propertyId')
      .lean();

    // Filter rooms that have all requested amenities
    const filteredRooms = matchedRooms.filter(r => {
      const amenityRefs = r.propertyaminities?.amenities?.map(a => a._id.toString()) || [];
      return amenityIds.every(id => amenityRefs.includes(id));
    });

    // Combine and format results
    const result = [
      ...filteredProperties.map(p => ({
        type: 'property',
        id: p._id,
        name: p.fullproperty?.name || 'Unnamed Property',
        finalPrice: p.fullprice,
        amenities: simplifyAmenities(p.propertyaminities?.amenities || []),
        address: p.PropertyAddress,
        images: p.fullproperty?.mediaInput || []
      })),
      ...filteredRooms.map(r => ({
        type: 'room',
        id: r._id,
        name: r.roomId?.name || 'Unnamed Room',
        finalPrice: r.basePrice,
        amenities: simplifyAmenities(r.propertyaminities?.amenities || []),
        address: r.PropertyAddress,
        images: r.roomId?.mediaInput || []
      }))
    ];

    res.status(200).json({
      success: true,
      total: result.length,
      data: result
    });

  } catch (error) {
    console.error('Error searching by amenities:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
//  searchPropertiesByAmenity = async (req, res) => {
//   try {
//     const { amenityId } = req.query;  // expecting comma-separated list of amenity IDs, e.g. ?amenityId=123,456

//     if (!amenityId) {
//       return res.status(400).json({ success: false, message: 'amenityId query parameter is required' });
//     }

//     // Split and sanitize IDs
//     const amenityIds = amenityId.split(',').map(id => id.trim());

//     // Convert to ObjectId if necessary (optional)
//     const amenityObjectIds = amenityIds.map(id => mongoose.Types.ObjectId(id));

//     // Find all properties whose amenities array contains any of the amenity IDs
//     // Assuming 'propertyaminities.amenities' is an array of ObjectId refs to Amenity documents
//     const properties = await propertyfullprice.find({
//       'propertyaminities.amenities': { $in: amenityObjectIds }
//     })
//       .populate('propertyaminities.amenities')   // populate amenity details
//       .populate('PropertyAddress')
//       .populate('fullproperty')
//       .lean();

//     res.status(200).json({
//       success: true,
//       total: properties.length,
//       data: properties
//     });
//   } catch (err) {
//     console.error('Error searching properties by amenity:', err);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };
}


function calculateFinalPrice({ basePrice, dayWisePrices, occasionPrices }) {
  const today = moment().startOf('day');
  // 1. Check for occasion
  const occ = Array.isArray(occasionPrices) && occasionPrices.find(o =>
    today.isSameOrAfter(moment(o.startDate).startOf('day')) &&
    today.isSameOrBefore(moment(o.endDate).endOf('day'))
  );
  if (occ) return occ.price;

  // 2. Check for daywise price
  const dayName = today.format('dddd');
  if (dayWisePrices && dayWisePrices[dayName] != null) return dayWisePrices[dayName];

  // 3. Fallback to base price
  return basePrice;
}

module.exports = new SearchController();