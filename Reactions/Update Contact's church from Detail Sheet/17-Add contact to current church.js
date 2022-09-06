/*
Add contacts to their current church (current church as determined from the Detail Sheet)
*/

// Load packages
const forEachOfSeries = require('async/forEachOfSeries');

// Set up headers
// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Set up results structures to return info to the next step
const addedContactToChurch = [];

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of contacts and churchces to loop through
const contactsAndChurchToAdd = [];

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    const thisContactAndChurches = contactsAndChurches[contacts[i]];
    const thisChurchOnDetailSheet = thisContactAndChurches.churchOnDetailSheet;

    // If the church on the detail sheet not null,
    // and is not in the church array
    if (!thisContactAndChurches.churches.includes(thisChurchOnDetailSheet)
    && thisChurchOnDetailSheet !== null) {
        // Add it to the array of churches to add to contats
        contactsAndChurchToAdd.push({
            contact: thisContactAndChurches.contact,
            church: thisChurchOnDetailSheet
        });
    }
}

// Function to execute on each contact
function joinGroup({ contact, church }, index, next) {
    // Make the body of the request the contact ID
    const body = {
        _id: contact
    };

    // https://api.fluro.io/teams/:teamID/join
    $fluro.api.post(`/teams/${church}/join`, body, headers)
        .then(() => {
            addedContactToChurch.push({
                contact,
                church
            });

            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function joinGroupCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    // Return results
    input.addedContactToChurch = addedContactToChurch;
    return done(null, input);
}

// Run the async function
return forEachOfSeries(contactsAndChurchToAdd, joinGroup, joinGroupCallback);
