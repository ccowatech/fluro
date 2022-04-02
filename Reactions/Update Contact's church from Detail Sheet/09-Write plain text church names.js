/*
Update detail sheets to include a plain text church title
*/

// Load packages
const _ = require('lodash');
const async = require('async');

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of detail sheets to update
const detailSheetsToUpdate = [];

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    const thisContact = contactsAndChurches[contacts[i]];

    // If the church title has been retrieved
    if (_.has(thisContact, 'churchOnDetailSheetTitle')) {
        // Add the detail sheet, and church to an array to process
        detailSheetsToUpdate.push({
            detailSheet: thisContact.detailSheet,
            church: thisContact.churchOnDetailSheetTitle
        });
    }
}

function updateDetailSheet(detailSheetToUpdate, index, next) {
    const body = {
        data: {
            churchAttendingTitle: detailSheetToUpdate.church
        }
    };

    // PUT https://api.fluro.io/content/:type/:id
    $fluro.api.put(`/content/churchDetails/${detailSheetToUpdate.detailSheet}`, body, headers)
        .then(() => next())
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function updateDetailSheetCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    // Return results
    return done(null, input);
}

// Run the async function
return async.forEachOfSeries(detailSheetsToUpdate, updateDetailSheet, updateDetailSheetCallback);
