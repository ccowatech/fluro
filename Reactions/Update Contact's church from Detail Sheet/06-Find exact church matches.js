/*
For contacts that say their church is not listed,
find exact matches for churches that already exist
*/

// Load packages
const has = require('lodash/has');
const startCase = require('lodash/startCase');
const forEachOfSeries = require('async/forEachOfSeries');

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Get input data needed
const { contacts, contactsAndChurches } = input;

// Build an array of new churches and contacts to process
const newChurchNamesAndContacts = {};

// Loop through contacts
for (let i = 0; i < contacts.length; i += 1) {
    // If contact has said their church is not listed
    if (contactsAndChurches[contacts[i]].churchIsNotListed) {
        const newChurch = {};
        const newChurchName = contactsAndChurches[contacts[i]].churchNotListedName;
        const contactsToAdd = [];
        const contactToAdd = contactsAndChurches[contacts[i]].contact;

        // If church name is not in the array already
        if (!has(newChurchNamesAndContacts, newChurchName)) {
            // Add the church name and contact to the list
            contactsToAdd.push(contactToAdd);

            newChurch.newChurchName = newChurchName;
            newChurch.contacts = contactsToAdd;

            newChurchNamesAndContacts[newChurchName] = newChurch;
        } else {
            // The church name is already in the list
            // Add the contact to the array
            newChurchNamesAndContacts[newChurchName].contacts.push(contactToAdd);
        }
    }
}

function searchForChurch({ newChurchName, contacts: contactsList }, index, next) {
    const body = {
        filter:
        {
            filters: [
                {
                    key: 'title', // The field to filter on
                    comparator: 'in', // The comparator to use
                    values: [ // Multiple values to check
                        newChurchName
                    ]
                }
            ]
        }
    };

    // POST https://api.fluro.io/content/:type/filter
    $fluro.api.post('/content/church/filter', body, headers)
        .then((res) => {
            if (res.data.length > 0) { // If any data is returned
                // Add the matched church to the contacts
                for (let i = 0; i < contactsList.length; i += 1) {
                    const thisContact = contactsList[i];
                    contactsAndChurches[thisContact].exactMatchChurch = res.data[0]._id;
                }

                // Remove the matched church from the list of new churchOnDetailSheet
                delete newChurchNamesAndContacts[res.data[0].title];
                // Also try removing the church if it's just a difference of capital letter
                delete newChurchNamesAndContacts[startCase(res.data[0].title)];
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
    return done(null, input);
}

// Run the async function
return forEachOfSeries(newChurchNamesAndContacts, searchForChurch, searchForChurchCallback);
