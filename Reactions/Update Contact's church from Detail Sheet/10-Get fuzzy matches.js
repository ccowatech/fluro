/*
For contacts that say their church is not listed,
and an exact match was not found,
find fuzzy matches for churches that already exist
*/

// Load packages
const _ = require('lodash');
const async = require('async');

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Set up results structures to return info to the next step
let newChurchesHaveBeenSubmitted = false;

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of new churches and contacts to process
const newChurchNamesAndContacts = {};

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    const thisContactAndChurch = contactsAndChurches[contacts[i]];

    // If contact has said their church is not listed …
    if (thisContactAndChurch.churchIsNotListed
    // AND an exact match has not been found
    && !_.has(thisContactAndChurch, 'exactMatchChurch')
    // AND the unlisted church name is not blank
    && thisContactAndChurch.churchNotListedName !== '') {
        newChurchesHaveBeenSubmitted = true;

        const newChurch = {};
        const newChurchName = thisContactAndChurch.churchNotListedName;
        const contactsToAdd = [];
        const contactToAdd = thisContactAndChurch.contact;

        // If church name is not in the array already
        if (!_.has(newChurchNamesAndContacts, newChurchName)) {
            // Add the church name and contact to the list
            newChurch.newChurchName = newChurchName;
            contactsToAdd.push(contactToAdd);
            newChurch.contacts = contactsToAdd;

            newChurchNamesAndContacts[newChurchName] = newChurch;
        } else {
            // The church name is already in the list
            // Add the contact to the array
            newChurchNamesAndContacts[newChurchName].contacts.push(contactToAdd);
        }
    }
}

// Fuzzy search for church name
function searchForChurch(newChurchNameAndContacts, index, next) {
    const body = {
        search: newChurchNameAndContacts.newChurchName
    };

    // POST https://api.fluro.io/content/:type/filter
    $fluro.api.post('/content/church/filter', body, headers)
        .then((res) => {
            // If any data is returned
            if (res.data.length > 0) {
                // Add the fuzzy matched churches to the contacts
                for (let i = 0; i < newChurchNameAndContacts.contacts.length; i += 1) {
                    contactsAndChurches[newChurchNameAndContacts.contacts[i]]
                        .fuzzyMatchedChurches = res.data;
                }
            }

            next();
        })
        .catch((err) => next(err));
}

// Callback function — after all iterations are finished
function searchForChurchCallback(err) {
    if (err) {
        const errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, 'STOP');
    }

    // Return results
    input.newChurchesHaveBeenSubmitted = newChurchesHaveBeenSubmitted;
    return done(null, input);
}

// Run the async function
return async.forEachOfSeries(newChurchNamesAndContacts, searchForChurch, searchForChurchCallback);
