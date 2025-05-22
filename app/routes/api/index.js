const express = require('express');
const app = express.Router();
const axios = require('axios');

// Geocode multiple addresses
app.get('/map/geocode-multiple', async (req, res) => {
  const { addresses } = req.query;
  if (!addresses) return res.status(400).send('Addresses are required.');

  const addressArray = addresses.split(',');

  try {
    const geocodePromises = addressArray.map(async (address) => {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'YourAppName/1.0 (your@email.com)', // Nominatim requires this
        },
      });

      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { address, lat, lon };
      }
      return { address, lat: null, lon: null };
    });

    const results = await Promise.all(geocodePromises);
    return res.json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error in geocoding');
  }
});
// Reverse geocode using Nominatim (OpenStreetMap)
app.get('/map/reverse-geocode', async (req, res) => {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
        return res.status(400).json({ error: 'Latitude and Longitude are required.' });
    }

    // Validate latitude and longitude format
    if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ error: 'Latitude and Longitude must be valid numbers.' });
    }

    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
            params: {
                lat,
                lon,
                format: 'json',
                addressdetails: 1,
            }
        });

        if (!response.data) {
            return res.status(404).json({ error: 'No address found for the given coordinates.' });
        }

        return res.json({ address: response.data.display_name });
    } catch (error) {
        console.error('Reverse geocoding error:', error.message);
        return res.status(500).json({ error: 'Error in reverse geocoding' });
    }
});

module.exports = app;
