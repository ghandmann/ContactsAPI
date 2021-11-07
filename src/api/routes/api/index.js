const contactsEndpoints = require('./contacts');
const phonenumberEndpoints = require('./phonenumbers');
const emailaddressEndpoints = require('./emailaddresses');

// This module just bundles all the API modules into one array for ease of use in app.js
module.exports = [
    contactsEndpoints,
    phonenumberEndpoints,
    emailaddressEndpoints
];