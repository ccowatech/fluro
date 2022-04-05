/*
Load the churches that each contact is in
*/

// Load packages
const forEachOfSeries = require('async/forEachOfSeries');

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Function to execute on each contact
function listGroups({ contact }, index, next) {
    const body = {
        _type: 'team',
        status: 'active',
        definition: 'church',
        provisionalMembers: contact
    };

    // https://api.fluro.io/content/_query
    $fluro.api.post('/content/_query/?select=title _id', body, headers)
        .then((res) => {
            const churches = [];

            // Construct an array of churches
            for (let i = 0; i < res.data.length; i += 1) {
                churches.push(res.data[i]._id);
            }
            contactsAndChurches[contact].churches = churches;
            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function listGroupsCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    // Replace input with updated data
    input = {
        contacts,
        contactsAndChurches
    };

    return done(null, input);
}

// Run the async function
return forEachOfSeries(contactsAndChurches, listGroups, listGroupsCallback);
