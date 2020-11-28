const NodeGeocoder = require('node-geocoder');

const options = {
    provider: process.env.GEOCODER_PROVIDER, // google,...

    // Optional depending on the providers
    // fetch: customFetchImplementation, // http adapter has been depreciated
    apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
