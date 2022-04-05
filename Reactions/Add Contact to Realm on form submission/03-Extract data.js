/*
Extract data we need
*/

// Load packages
const has = require('lodash/has');

// Get data from input
const interactionRealms = input.item.realms;
const inputContacts = input.data.submittedData.data.contact;

let contacts = [];

// If single contact object
if (has(inputContacts, '_id')) {
    contacts.push(inputContacts);

// If array of contact objects
} else if (inputContacts instanceof Array && inputContacts.length > 0) {
    contacts = inputContacts;

// Else seems like there are no contacts attached. Stop the Reaction.
} else {
    return done(null, 'STOP');
}

// Replace input with only the data we need
input = { interactionRealms, contacts };

// Finish the action and send the input to the next action
return done(null, input);
