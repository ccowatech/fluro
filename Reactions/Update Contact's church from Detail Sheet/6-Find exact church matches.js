/*
For contacts that say their church is not listed,
find exact matches for churches that already exist
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
//const createdNewChurch = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');

// Build an array of new churches and contacts to process
let newChurchNamesAndContacts = {};

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    if(contactsAndChurches[contacts[i]].churchIsNotListed) { // If contact has said their church is not listed

        let newChurch = {};
        let newChurchName = contactsAndChurches[contacts[i]].churchNotListedName;
        let contactsToAdd = [];
        let contactToAdd = contactsAndChurches[contacts[i]].contact;

        if(!newChurchNamesAndContacts.hasOwnProperty(newChurchName)) { // If church name is not in the array already

            // Add the church name and contact to the list
            newChurch.newChurchName = newChurchName;
            contactsToAdd.push(contactToAdd);
            newChurch.contacts = contactsToAdd;

            newChurchNamesAndContacts[newChurchName] = newChurch;

        } else { // The church name is already in the list

            // Add the contact to the array
            newChurchNamesAndContacts[newChurchName].contacts.push(contactToAdd);
        }
    }
}

// Run the async function
return async.forEachOfSeries(newChurchNamesAndContacts, searchForChurch, searchForChurchCallback);

function searchForChurch(newChurchNameAndContacts, index, next) {

    let body = {

        "filter":
        {
            "filters": [
            {
                "key": "title", //The field to filter on
                "comparator": "in", //The comparator to use
                "values": [ //Multiple values to check
                    newChurchNameAndContacts.newChurchName
                ]
            }]
        }
    };

    // POST https://api.fluro.io/content/:type/filter
    $fluro.api.post(`/content/church/filter`, body, headers)
        .then(res => {
            console.log(res);

            if(res.data.length > 0) { // If any data is returned

                // Add the matched church to the contacts
                for(let i=0; i<newChurchNameAndContacts.contacts.length; i++) {
                    contactsAndChurches[newChurchNameAndContacts.contacts[i]].exactMatchChurch = res.data[0]._id;
                }

                // Remove the matched church from the list of new churchOnDetailSheet
                delete newChurchNamesAndContacts[res.data[0].title];
                delete newChurchNamesAndContacts[_.startCase(res.data[0].title)]; // Also try removing the church if it's just a difference of capital letter
            }

            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function searchForChurchCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results
    //input.newChurchNamesAndContacts = newChurchNamesAndContacts;
    return done(null, input);
}
