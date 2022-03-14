/*
Add contacts to their current church (current church as determined from the Detail Sheet)
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up headers
// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
const addedContactToChurch = [];

// Get input data needed
let contactsAndChurches = _.get(input, 'contactsAndChurches');
let contacts = _.get(input, 'contacts');

// Build an array of contacts and churchces to loop through
let contactsAndChurchToAdd = [];

for(let i=0; i<contacts.length; i++) { // Loop through contacts

    // If the church on the detail sheet not null, and is not in the church array, add it to the array of churches to add to contats
    if(!contactsAndChurches[contacts[i]].churches.includes(contactsAndChurches[contacts[i]].churchOnDetailSheet) && contactsAndChurches[contacts[i]].churchOnDetailSheet !== null) {
        contactsAndChurchToAdd.push({
            "contact": contactsAndChurches[contacts[i]].contact,
            "church": contactsAndChurches[contacts[i]].churchOnDetailSheet
        });
    }
}

// Run the async function
return async.forEachOfSeries(contactsAndChurchToAdd, joinGroup, joinGroupCallback);

// Function to execute on each contact
function joinGroup(contactAndChurchToAdd, index, next) {

    // Make the body of the request the contact ID
    let body = {
        "_id": contactAndChurchToAdd.contact
    };

     // https://api.fluro.io/teams/:teamID/join
     $fluro.api.post(`/teams/${contactAndChurchToAdd.church}/join`, body, headers)
        .then(res => {
            console.log(res);

            addedContactToChurch.push({
                "contact": contactAndChurchToAdd.contact,
                "church": contactAndChurchToAdd.church
            });

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function joinGroupCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results
	input.addedContactToChurch = addedContactToChurch;
	return done(null, input);
}
