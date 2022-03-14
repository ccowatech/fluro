/*
Remove contacts from churches that they're no longer in
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up results structures to return info to the next step
const result = {};
const removedContactFromChurch = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');

// Make an array of contact/church combinations to process
let contactAndChurchCombosToRemove = [];

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    // Loop through churches to remove for each contact
    for(let j=0; j<contactsAndChurches[contacts[i]].churches.length; j++) {

        if((contactsAndChurches[contacts[i]].churches[j] != contactsAndChurches[contacts[i]].churchOnDetailSheet) // IF church is not the church on the detail sheet
            || contactsAndChurches[contacts[i]].churchIsNotListed // OR Person has said their church is not listed
            || contactsAndChurches[contacts[i]].attendsChurch == "no") { // OR Person has said they don't attend church at all

            // Add the contact and church to the list to remove
            contactAndChurchCombosToRemove.push({
                contact: contacts[i],
                church: contactsAndChurches[contacts[i]].churches[j]
            });
        }
    }
}

// Run the async function
return async.forEachOfSeries(contactAndChurchCombosToRemove, leaveGroup, leaveGroupCallback);

// Function to execute on each contact
function leaveGroup(contactAndChurchCombo, index, next) {

    // https://api.fluro.io/teams/:teamID/leave/:contactID
    $fluro.api.delete(`/teams/${contactAndChurchCombo.church}/leave/${contactAndChurchCombo.contact}`)
        .then(res => {
            console.log(res);

            removedContactFromChurch.push(contactAndChurchCombo);

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function leaveGroupCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results
	result.removedContactFromChurch = removedContactFromChurch;
	input.result = result;
	return done(null, input);
}
