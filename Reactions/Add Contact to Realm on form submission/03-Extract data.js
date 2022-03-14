/*
Extract data we need
*/

// Get data from input
var interactionRealms = input.item.realms;
var contacts = input.data.submittedData.data.contact;


// Clear input
input = {};

// Replace input with only the data we need
input.interactionRealms = interactionRealms;
input.contacts = contacts;

// Finish the action and send the input to the next action
return done(null, input)
