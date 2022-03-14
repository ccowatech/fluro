/*
Update detail sheets to include a plain text church title
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
const updatedDetailSheets = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');


// Build an array of detail sheets to update
let detailSheetsToUpdate = [];

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    if(contactsAndChurches[contacts[i]].hasOwnProperty('churchOnDetailSheetTitle')) { // If the church title has been retrieved

        // Add the detail sheet, and church to an array to process
        detailSheetsToUpdate.push({
            "detailSheet": contactsAndChurches[contacts[i]].detailSheet,
            "church": contactsAndChurches[contacts[i]].churchOnDetailSheetTitle
        });
    }
}

// Run the async function
return async.forEachOfSeries(detailSheetsToUpdate, updateDetailSheet, updateDetailSheetCallback);

function updateDetailSheet(detailSheetToUpdate, index, next) {

    let body = {
        "data": {
            "churchAttendingTitle": detailSheetToUpdate.church
        }
    };

    // PUT https://api.fluro.io/content/:type/:id
    $fluro.api.put("/content/churchDetails/"+detailSheetToUpdate.detailSheet, body, headers)
        .then(res => {
            console.log(res);

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function updateDetailSheetCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results


	return done(null, input);
}
