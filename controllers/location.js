const Location = require('../models/location');

// Get location
module.exports.getLocation = async (req, res) => {
    try {
        // if any, send coordinates to render map
        const coordinates = await Location.findOne({});
        if (coordinates) {
            res.send(coordinates);
        } else {
            // if not, send this text to render instead of map
            res.send({ html: 'Not Currently at an Event' });
        }
    } catch (e) {
        // if couldnt find events, send message to front end
        res.send({ error: `Something went wrong: <br> Could not get location.` });
    }
}

// Post Location
module.exports.postLocation = async (req, res) => {
    try {
        // mapbox token to add in on creation
        const mapboxToken = process.env.MAPBOXTOKEN;
        // Delete old coordinates first so that there cant be two sets
        await Location.findOneAndDelete({});
        // Make new location
        const newLocation = new Location();
        newLocation.longitude = req.body.long;
        newLocation.latitude = req.body.lat;
        newLocation.mapboxToken = mapboxToken;
        const saved = await newLocation.save();
        res.send(saved);
    } catch (e) {
        res.send({ error: e })
    }
}

// Delete Location
module.exports.deleteLocation = async (req, res) => {
    try {
        const coordinates = await Location.findOneAndDelete({});
        res.send(coordinates);
    } catch (e) {
        res.send({ error: e })
    }
}