/*
Retrieve titles for the churches on the detail sheets
*/

// Load packages
const _ = require('lodash');
const async = require('async');

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of contacts and churches to look up
const contactsAndChurchesToLookUp = [];

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    const thisContactAndChurch = contactsAndChurches[contacts[i]];

    // If there's a church reference on the detail sheet
    if (_.has(thisContactAndChurch, 'churchOnDetailSheet')) {
        // Add the contact and church ID to an array to process
        contactsAndChurchesToLookUp.push({
            contact: contacts[i],
            church: thisContactAndChurch.churchOnDetailSheet
        });
    }
}

function lookUpChurchTitle({ contact, church }, index, next) {
    const thisContactAndChurch = contactsAndChurches[contact];

    // GET https://api.fluro.io/content/get/:id
    $fluro.api.get(`/content/get/${church}`)
        .then((res) => {
            thisContactAndChurch.churchOnDetailSheetTitle = res.data.title;

            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function lookUpChurchTitleCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    input.contactsAndChurches = contactsAndChurches;

    return done(null, input);
}

// Run the async functions
return async.forEachOfSeries(
    contactsAndChurchesToLookUp,
    lookUpChurchTitle,
    lookUpChurchTitleCallback
);
