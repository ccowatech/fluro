/*
Format data based on what it is
*/

// Load packages
const has = require('lodash/has');

// Get data from input
const { inputType } = input;
let contacts = [];

// If input is a detail sheet
if (input.inputType === 'detailSheet') {
    contacts.push(input.item.contact);

// If input is an Interaction
} else if (input.inputType === 'interaction') {
    // If there are no contacts, stop the Reaction
    if (!has(input.data.submittedData, 'contacts')) return done(null, 'STOP');

    contacts = input.data.submittedData.contacts;
}

// If no contacts, stop the Reaction
if (contacts.length === 0) return done(null, 'STOP');

// Replace input with only the data we need
input = {
    inputType,
    contacts
};

// Finish the action and send the input to the next action

return done(null, input);
