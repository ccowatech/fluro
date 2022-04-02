/*
Extract data we need
*/

// Load packages
const _ = require('lodash');

// Get data from input
const interactionRealms = input.item.realms;
const inputContacts = input.data.submittedData.data.contact;

let contacts = [];

// If single contact object
if (_.has(inputContacts, '_id')) {
    contacts.push(inputContacts);

// If array of contact objects
} else if (_.isArray(inputContacts)) {
    contacts = inputContacts;

// Else seems like there are no contacts attached. Stop the Reaction.
} else {
    return done(null, 'STOP');
}

// Replace input with only the data we need
input = { interactionRealms, contacts };

// Finish the action and send the input to the next action
return done(null, input);
