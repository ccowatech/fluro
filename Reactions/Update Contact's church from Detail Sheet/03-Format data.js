/*
Format data based on what it is
*/

// Load packages
const has = require('lodash/has');

// Get data from input
const { inputType, item } = input;
let contacts = [];
let definition;
let interactionID;

// If input is a detail sheet
if (input.inputType === 'detailSheet') {
    contacts.push(item.contact);

// If input is an Interaction
} else if (input.inputType === 'interaction') {
    // If there are no contacts, stop the Reaction
    if (!has(item, 'contacts')) return done(null, 'STOP');

    contacts = item.contacts;
    definition = item.definition;
    interactionID = item._id;
}

// If no contacts, stop the Reaction
if (contacts.length === 0) return done(null, 'STOP');

// Replace input with only the data we need
input = {
    inputType,
    definition,
    interactionID,
    contacts
};

// Finish the action and send the input to the next action

return done(null, input);