/*
Format input based on what it is.
*/

// Load packages
const has = require('lodash/has');

// Create variables
let inputType;
let contacts;

// Check that this is an interaction with contacts attached, then check for trigger type
if (input.data._type === 'interaction' && has(input.item, 'contacts') && input.trigger === 'content.create') {
    inputType = 'autoInteraction';
    contacts = input.item.contacts;
} else if (input.data._type === 'interaction' && has(input.item, 'contacts') && input.trigger === 'manual.spark') {
    inputType = 'manualInteraction';
    contacts = input.item.contacts;
} else {
    inputType = 'unknown';
}

// Return data
input = {};
input.inputType = inputType;
input.contacts = contacts;

return done(null, input);
