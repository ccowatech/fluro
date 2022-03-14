/*
Format data based on what it is
*/

// Get data from input
let inputType = input.inputType;
let contacts = [];

if(input.inputType == "detailSheet") { // Input is a detail sheet
    contacts.push(input.item.contact);
} else if(input.inputType == "interaction") { // Input is an Interaction
    contacts = input.data.submittedData.contacts;
}

// Clear input
input = {};

// Replace input with only the data we need
input.inputType = inputType;
input.contacts = contacts;

// Finish the action and send the input to the next action

return done(null, input);
