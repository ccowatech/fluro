/*
Remove contacts from the contact array if they don't have detail sheets attached
*/

// Load packages
const has = require('lodash/has');

// Get input data needed
const { inputType, definition, interactionID, contacts, contactsAndChurches } = input;
const contactsWithoutDetailSheets = [];

// Copy contact IDs without detail sheets to new array
for (let i = 0; i < contacts.length; i += 1) {
    if(!has(contactsAndChurches, contacts[i])) {
        contactsWithoutDetailSheets.push(contacts[i]);
    }
}
// Remove contact IDs without detail sheets from contact array
for (let i = 0; i < contactsWithoutDetailSheets.length; i += 1) {
    contacts.pop(contactsWithoutDetailSheets[i]);  
}

// Replace input with only the data we need
input = {
    inputType,
    definition,
    interactionID,
    contacts,
    contactsWithoutDetailSheets,
    contactsAndChurches
};

// Finish the action and send the input to the next action
return done(null, input);