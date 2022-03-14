/*
Load the churches that each contact is in
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');

// Run the async function
return async.forEachOfSeries(contactsAndChurches, listGroups, listGroupsCallback);

// Function to execute on each contact
function listGroups(contactAndChurches, index, next) {

    var body = {
        "_type": "team",
        "status": "active",
        "definition": "church",
        "provisionalMembers": contactAndChurches.contact
    };

    // https://api.fluro.io/content/_query
    $fluro.api.post(`/content/_query/?select=title _id`, body, headers)
        .then(res => {
            console.log(res);

            let churches = [];

            // Construct an array of churches
            for(let i = 0; i < res.data.length; i++) {
                    churches.push(res.data[i]["_id"]);
            }

            contactsAndChurches[contactAndChurches.contact].churches = churches;

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function listGroupsCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

    // Clear the input
    input = {};

	// Return results
    input.contacts = contacts;
    input.contactsAndChurches = contactsAndChurches;
	return done(null, input);
}
