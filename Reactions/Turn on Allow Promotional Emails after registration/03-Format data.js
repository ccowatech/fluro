/*
Format input based on what it is.
*/

// Create variables
let inputType;
let contacts;

// Check that this is an interaction with contacts attached, then check for trigger type
if (input.data._type === 'interaction' && input.item.hasOwnProperty('contacts') && input.trigger === 'content.create') {
    inputType = 'autoInteraction';
    contacts = input.item.contacts;
} else if (input.data._type === 'interaction' && input.item.hasOwnProperty('contacts') && input.trigger === 'manual.spark') {
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
