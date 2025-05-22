// allpropertiesandrooms = async (req, res) => {
//   try {
//     const locationQuery = req.query.location ? req.query.location.trim() : '';

//     // Only filter if location is provided, else show all
//     const addressMatch = locationQuery
//       ? {
//           $or: [
//             { 'PropertyAddress.fullAddress': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.city': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.state': { $regex: locationQuery, $options: 'i' } },
//             { 'PropertyAddress.pincode': { $regex: locationQuery, $options: 'i' } }
//           ]
//         }
//       : null;

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
//       if (addressMatch) pipeline.push({ $match: addressMatch });
//       return pipeline;
//     }

//     const properties = await propertyfullprice.aggregate(buildPipeline());
//     const rooms = await RoomPrice.aggregate(buildPipeline());

//     const calculateFinalPrice = (base, dayWise, occasions) => {
//       const currentDay = moment().format('dddd');
//       const currentDateOnly = moment().format('YYYY-MM-DD');
//       const occ = occasions?.find(o =>
//         moment(currentDateOnly).isBetween(moment(o.startDate).format('YYYY-MM-DD'), moment(o.endDate).format('YYYY-MM-DD'), null, '[]')
//       );
//       if (occ) return occ.price;
//       if (dayWise?.[currentDay] != null) return dayWise[currentDay];
//       return base;
//     };

//     const propertyItems = properties.map(p => ({
//       ...p,
//       type: 'property',
//       cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
//       cardPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
//       finalPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
//       cardImages: p.fullproperty?.mediaInput || [],
//       PropertyAddress: p.PropertyAddress,
//     }));

//     const roomItems = rooms.map(r => ({
//       ...r,
//       type: 'room',
//       cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
//       cardPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
//       finalPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
//       cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
//       PropertyAddress: r.PropertyAddress,
//     }));

//     const items = [...propertyItems, ...roomItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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

allpropertiesandrooms = async (req, res) => {
  try {
    const locationQuery = req.query.location ? req.query.location.trim() : '';

    // Parse location for city and state if present
    let city = '', state = '';
    if (locationQuery) {
      const parts = locationQuery.split(',').map(p => p.trim()).filter(Boolean);
      city = parts[0] || '';
      state = parts[1] || '';
    }

    // Build address match filter
    let addressMatch = null;
    if (city && state) {
      // Both city and state provided
      addressMatch = {
        $and: [
          { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
          { 'PropertyAddress.state': { $regex: state, $options: 'i' } }
        ]
      };
    } else if (city) {
      // Only city (or one part) provided, match either city or state
      addressMatch = {
        $or: [
          { 'PropertyAddress.city': { $regex: city, $options: 'i' } },
          { 'PropertyAddress.state': { $regex: city, $options: 'i' } }
        ]
      };
    }

    function buildPipeline() {
      const pipeline = [
        {
          $lookup: {
            from: 'propertyaddresses',
            localField: 'PropertyAddress',
            foreignField: '_id',
            as: 'PropertyAddress'
          }
        },
        { $unwind: '$PropertyAddress' }
      ];
      if (addressMatch) pipeline.push({ $match: addressMatch });
      return pipeline;
    }

    const properties = await propertyfullprice.aggregate(buildPipeline());
    const rooms = await RoomPrice.aggregate(buildPipeline());

    const calculateFinalPrice = (base, dayWise, occasions) => {
      const currentDay = moment().format('dddd');
      const currentDateOnly = moment().format('YYYY-MM-DD');
      const occ = occasions?.find(o =>
        moment(currentDateOnly).isBetween(moment(o.startDate).format('YYYY-MM-DD'), moment(o.endDate).format('YYYY-MM-DD'), null, '[]')
      );
      if (occ) return occ.price;
      if (dayWise?.[currentDay] != null) return dayWise[currentDay];
      return base;
    };

    const propertyItems = properties.map(p => ({
      ...p,
      type: 'property',
      cardTitle: p.PropertyAddress?.propertyName || p.fullproperty?.name || 'No Name',
      cardPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
      finalPrice: calculateFinalPrice(p.fullprice, p.dayWisePrices, p.occationprice || []),
      cardImages: p.fullproperty?.mediaInput || [],
      PropertyAddress: p.PropertyAddress,
    }));

    const roomItems = rooms.map(r => ({
      ...r,
      type: 'room',
      cardTitle: r.roomId?.name || r.fullproperty?.name || 'No Name',
      cardPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
      finalPrice: calculateFinalPrice(r.basePrice, r.dayWisePrices, r.occasionPrices || []),
      cardImages: [...(r.roomId?.mediaInput || []), ...(r.fullproperty?.mediaInput || [])],
      PropertyAddress: r.PropertyAddress,
    }));

    const items = [...propertyItems, ...roomItems].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.render('Admin/allproperties', {
      items,
      locationQuery,
      checkInDate: req.query.checkInDate,
      checkOutDate: req.query.checkOutDate,
      adults: req.query.adults,
      children: req.query.children,
      rooms: req.query.rooms,
      withPets: req.query.withPets === 'true',
      userLogin: req.user?.username || 'Guest',
      moment,
      currentUTC: moment().utc('+05:30').format('YYYY-MM-DD HH:mm:ss')
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Server Error');
  }
};