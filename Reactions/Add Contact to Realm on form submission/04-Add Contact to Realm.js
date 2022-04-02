/*
Add Contact to Realm
*/

// Load packages
// const _ = require('lodash');
const async = require('async');

// Get input data needed
const { interactionRealms, contacts } = input;

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Set up results structures to return info to the next step
const result = {};
const successfulContacts = [];

// Function to execute on each contact
function updateRealms(contact, index, next) {
    const contactRealms = contact.realms;
    const newRealms = contactRealms.concat(interactionRealms);

    const body = {
        realms: newRealms
    };

    $fluro.api.put(`/content/contact/${contact._id}`, body, headers)
        .then(() => {
            successfulContacts.push(contact._id);
            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function callback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }
    // Return results
    result.successfulContacts = successfulContacts;

    input.result = result;
    return done(null, input);
}

// Run the async functions
return async.forEachOfSeries(contacts, updateRealms, callback);
