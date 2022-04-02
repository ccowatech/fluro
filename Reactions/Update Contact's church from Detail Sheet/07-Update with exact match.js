/*
If there's an exact match, update the detail sheet to point to the matched church
*/

// Load packages
const _ = require('lodash');
const async = require('async');

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Set up results structures to return info to the next step
const updatedDetailSheets = [];

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of detail sheets to update
const detailSheetsToUpdate = [];

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    // If we've just found the church for the contact
    const thisContactAndChurches = contactsAndChurches[contacts[i]];

    if (_.has(thisContactAndChurches, 'exactMatchChurch')) {
        // Add the contact, detail sheet, and church to an array to process
        detailSheetsToUpdate.push({
            contact: contacts[i],
            detailSheet: thisContactAndChurches.detailSheet,
            exactMatchChurch: thisContactAndChurches.exactMatchChurch
        });
    }
}

function updateDetailSheet({ contact, detailSheet, exactMatchChurch }, index, next) {
    const body = {
        data: {
            churchIsNotListed: false,
            churchAttending: {
                _id: exactMatchChurch
            }
        }
    };

    // PUT https://api.fluro.io/content/:type/:id
    $fluro.api.put(`/content/churchDetails/${detailSheet}`, body, headers)
        .then((res) => {
            if (res.data.length > 0) { // If any data is returned
                updatedDetailSheets.push(res.data[0]);
            }

            contactsAndChurches[contact]
                .churchOnDetailSheet = exactMatchChurch;

            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function updateDetailSheetCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    return done(null, input);
}

// Run the async function
return async.forEachOfSeries(detailSheetsToUpdate, updateDetailSheet, updateDetailSheetCallback);
