/*
Extract data from detail sheets that we need, clear the rest
*/

// Load packages
const has = require('lodash/has');

// Get input
const { detailSheets, contacts } = input;
const contactsAndChurches = {};

for (let i = 0; i < detailSheets.length; i += 1) {
    // Filter out all the non-churchDetails sheets inactive church detail sheets
    if (detailSheets[i].definition === 'churchDetails' && detailSheets[i].status === 'active') {
        contactsAndChurches[detailSheets[i].contact] = {
            contact: detailSheets[i].contact,
            detailSheet: detailSheets[i]._id,
            attendsChurch: detailSheets[i].data.attendsChurch
        };

        if (has(detailSheets[i].data, 'churchAttending')) {
            if (detailSheets[i].data.churchAttending != null) {
                if (has(detailSheets[i].data.churchAttending, '_id')) {
                    // In case churchAttending is an object with an ID
                    contactsAndChurches[detailSheets[i].contact]
                        .churchOnDetailSheet = detailSheets[i].data.churchAttending._id;
                } else {
                    // In case churchAttending is a string containing the ID
                    contactsAndChurches[detailSheets[i].contact]
                        .churchOnDetailSheet = detailSheets[i].data.churchAttending;
                }
            }
        }
        if (has(detailSheets[i].data, 'churchNotListedName') && has(detailSheets[i].data, 'churchIsNotListed')) {
            if (detailSheets[i].data.churchIsNotListed === true) {
                contactsAndChurches[detailSheets[i].contact]
                    .churchIsNotListed = detailSheets[i].data.churchIsNotListed;
                contactsAndChurches[detailSheets[i].contact]
                    .churchNotListedName = detailSheets[i].data.churchNotListedName;
            }
        }
    }
}

// Clear the input and put back what we want
input = {};
input.contacts = contacts;
input.contactsAndChurches = contactsAndChurches;

return done(null, input);
