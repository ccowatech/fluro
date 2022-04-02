/*
Remove contacts from churches that they're no longer in
*/

// Load packages
const async = require('async');

// Set up results structures to return info to the next step
const result = {};
const removedContactFromChurch = [];

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Make an array of contact/church combinations to process
const contactAndChurchCombosToRemove = [];

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    const thisContactAndChurches = contactsAndChurches[contacts[i]];

    // Loop through churches to remove for each contact
    for (let j = 0; j < contactsAndChurches[contacts[i]].churches.length; j += 1) {
        // If church is not the church on the detail sheet
        if ((thisContactAndChurches.churches[j] !== thisContactAndChurches.churchOnDetailSheet)
        // Or Person has said their church is not listed
        || thisContactAndChurches.churchIsNotListed
        // Or Person has said they don't attend church at all
        || thisContactAndChurches.attendsChurch === 'no') {
            // Add the contact and church to the list to remove
            contactAndChurchCombosToRemove.push({
                contact: contacts[i],
                church: thisContactAndChurches.churches[j]
            });
        }
    }
}

// Function to execute on each contact
function leaveGroup(contactAndChurchCombo, index, next) {
    // https://api.fluro.io/teams/:teamID/leave/:contactID
    $fluro.api.delete(`/teams/${contactAndChurchCombo.church}/leave/${contactAndChurchCombo.contact}`)
        .then(() => {
            removedContactFromChurch.push(contactAndChurchCombo);
            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function leaveGroupCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    // Return results
    result.removedContactFromChurch = removedContactFromChurch;
    input.result = result;
    return done(null, input);
}

// Run the async function
return async.forEachOfSeries(contactAndChurchCombosToRemove, leaveGroup, leaveGroupCallback);
