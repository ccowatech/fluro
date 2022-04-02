/*
Extract data we need
*/

// Get data from input
const interactionRealms = input.item.realms;
const contacts = input.data.submittedData.data.contact;

// Replace input with only the data we need
input = { interactionRealms, contacts };

// Finish the action and send the input to the next action
return done(null, input);
