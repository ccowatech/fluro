/*
Format data based on what it is
*/

// Get data from input
const { inputType } = input;
let contacts = [];

if (input.inputType === 'detailSheet') { // Input is a detail sheet
    contacts.push(input.item.contact);
} else if (input.inputType === 'interaction') { // Input is an Interaction
    contacts = input.data.submittedData.contacts;
}

// Replace input with only the data we need
input = {
    inputType,
    contacts
};

// Finish the action and send the input to the next action

return done(null, input);
