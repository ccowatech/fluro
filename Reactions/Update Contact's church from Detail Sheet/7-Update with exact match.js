/*
If there's an exact match, update the detail sheet to point to the matched church
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
//const createdNewChurch = [];
const updatedDetailSheets = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');


// Build an array of detail sheets to update
let detailSheetsToUpdate = [];

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    if(contactsAndChurches[contacts[i]].hasOwnProperty('exactMatchChurch')) { // If we've just found the church for the contact

        // Add the contact, detail sheet, and church to an array to process
        detailSheetsToUpdate.push({
            "contact": contacts[i],
            "detailSheet": contactsAndChurches[contacts[i]].detailSheet,
            "exactMatchChurch": contactsAndChurches[contacts[i]].exactMatchChurch
        });
    }
}

// Run the async function
return async.forEachOfSeries(detailSheetsToUpdate, updateDetailSheet, updateDetailSheetCallback);

function updateDetailSheet(detailSheetToUpdate, index, next) {

    let body = {
        "data": {
            "churchIsNotListed":false,
            "churchAttending": {
                "_id": detailSheetToUpdate.exactMatchChurch
            },
            "churchAttendingText": detailSheet
        }
    };

    // PUT https://api.fluro.io/content/:type/:id
    $fluro.api.put("/content/churchDetails/"+detailSheetToUpdate.detailSheet, body, headers)
        .then(res => {
            console.log(res);

            if(res.data.length > 0) { // If any data is returned

                updatedDetailSheets.push(res.data[0]);
            }

            contactsAndChurches[detailSheetToUpdate.contact].churchOnDetailSheet = detailSheetToUpdate.exactMatchChurch;

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
    //input.updatedDetailSheets = updatedDetailSheets;
    //input.detailSheetsToUpdate = detailSheetsToUpdate;


	return done(null, input);
}
