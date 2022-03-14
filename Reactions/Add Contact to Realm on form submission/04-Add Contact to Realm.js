/*
Add Contact to Realm
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
const result = {};
const functionResults = [];
const successfulContacts = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let interactionRealms = _.get(input, 'interactionRealms');

// Run the async functions
return async.forEachOfSeries(contacts, updateRealms, callback);

// Function to execute on each contact
function updateRealms(contact, index, next) {
    let contactRealms = contact.realms;
    let newRealms = contactRealms.concat(interactionRealms);

    let body = {
        realms: newRealms
    }

    $fluro.api.put(`/content/contact/${contact._id}`, body, headers)
        .then(res => {
            console.log(res);
            //functionResults.push(res); // Doesn't seem to work
            successfulContacts.push(contact._id);

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function callback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }
		// Return results
		result.successfulContacts = successfulContacts;
		//result.functionResults = functionResults; // Doesn't seem to work

		input.result = result;
		return done(null, input);
}
