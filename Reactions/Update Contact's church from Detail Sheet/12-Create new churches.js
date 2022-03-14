/*
NOT CURRENTLY FUNCTIONAL

Create new churches if necessary
*/

//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step
//const createdNewChurch = [];
//const foundChurches = [];

// Get input data needed
let contacts = _.get(input, 'contacts');
let contactsAndChurches = _.get(input, 'contactsAndChurches');

// Build an array of new churches and contacts to process
let newChurchNamesAndContacts = {};

// Loop through contacts
for(let i=0; i<contacts.length; i++) {

    if(contactsAndChurches[contacts[i]].hasOwnProperty('churchNotListedName')) { // If contact has said their church is not listed

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

input.newChurchNamesAndContacts = newChurchNamesAndContacts;

// Run the async function
return async.forEachOfSeries(newChurchNamesAndContacts, searchForChurch, searchForChurchCallback);

//return async.forEachOfSeries(newChurchNamesToCreate, createChurch, createChurchCallback);

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
                for(let i=0; i<newChurchNameAndContacts.contacts.length; i++) {
                    contactsAndChurches[newChurchNameAndContacts.contacts[i]].foundChurch = res.data[0]._id;
                }

                /*foundChurches.push({
                    "foundChurchName": res.data[0].title,
                    "foundChurch": res.data[0]._id,
                    "contacts": newChurchNameAndContacts.contacts
                });*/
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
    //input.foundChurches = foundChurches;

	return done(null, input);
}


// Function to execute on each contact
function createChurch(newChurchName, index, next) {

    let body = {

        //"definition": "church",
        "title": newChurchName,
        "realms": ["61f546264d66c70018d73006"]
    };

    // https://api.fluro.io/content/:type
    $fluro.api.post(`/content/church`, body, headers)
        .then(res => {
            console.log(res);

            createdNewChurch.push(Object.keys(res));/*newChurchName*/


            next();
        })
        .catch(err => next(err));
}

// Callback function — after all iterations are finished
function createChurchCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results
    input.newChurchNamesToCreate = newChurchNamesToCreate;
	input.createdNewChurch = createdNewChurch;
	return done(null, input);
}
