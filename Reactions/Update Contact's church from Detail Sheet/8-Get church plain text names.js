/*
Retrieve titles for the churches on the detail sheets
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step


// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');

// Build an array of contacts and churches to look up
let contactsAndChurchesToLookUp = [];

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    if(contactsAndChurches[contacts[i]].hasOwnProperty('churchOnDetailSheet')) { // If there's a church reference on the detail sheet

        // Add the contact and church ID to an array to process
        contactsAndChurchesToLookUp.push({
            "contact": contacts[i],
            "church": contactsAndChurches[contacts[i]].churchOnDetailSheet
        });
    }
}


// Run the async functions
return async.forEachOfSeries(contactsAndChurchesToLookUp, lookUpChurchTitle, lookUpChurchTitleCallback);

function lookUpChurchTitle(contactAndChurch, index, next) {

    // GET https://api.fluro.io/content/get/:id
    $fluro.api.get("/content/get/"+contactAndChurch.church)
        .then(res => {
            console.log(res);

            contactsAndChurches[contactAndChurch.contact].churchOnDetailSheetTitle = res.data.title;

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function lookUpChurchTitleCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

    input.contactsAndChurches = contactsAndChurches;

	return done(null, input);
}
