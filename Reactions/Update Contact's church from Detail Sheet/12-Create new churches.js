/*
NOT CURRENTLY FUNCTIONAL

Create new churches if necessary
*/

// // Load packages
// const has = require('lodash/has');
// const forEachOfSeries = require('async/forEachOfSeries');

// // Set up request headers
// const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// // Get input data needed
// const { contacts, contactsAndChurches } = input;

// // Build an array of new churches and contacts to process
// const newChurchNamesAndContacts = {};

// // Loop through contacts
// for (let i = 0; i < contacts.length; i += 1) {
//     const thisContactAndChurch = contactsAndChurches[contacts[i]];

//     // If contact has said their church is not listed
//     if (has(thisContactAndChurch 'churchNotListedName')) {
//         const newChurch = {};
//         const newChurchName = thisContactAndChurch.churchNotListedName;
//         const contactsToAdd = [];
//         const contactToAdd = thisContactAndChurch.contact;

//         // If church name is not in the array already
//         if (!has(newChurchNamesAndContacts, newChurchName)) {
//             // Add the church name and contact to the list
//             newChurch.newChurchName = newChurchName;
//             contactsToAdd.push(contactToAdd);
//             newChurch.contacts = contactsToAdd;

//             newChurchNamesAndContacts[newChurchName] = newChurch;
//         } else {
//             // The church name is already in the list
//             // Add the contact to the array
//             newChurchNamesAndContacts[newChurchName].contacts.push(contactToAdd);
//         }
//     }
// }

// input.newChurchNamesAndContacts = newChurchNamesAndContacts;

// function searchForChurch(newChurchNameAndContacts, index, next) {
//     const body = {
//         filter: {
//             filters: [{
//                 key: 'title', // The field to filter on
//                 comparator: 'in', // The comparator to use
//                 values: [ // Multiple values to check
//                     newChurchNameAndContacts.newChurchName
//                 ]
//             }]
//         }
//     };

//     // POST https://api.fluro.io/content/:type/filter
//     $fluro.api.post('/content/church/filter', body, headers)
//         .then((res) => {
//             // If any data is returned
//             if (res.data.length > 0) {
//                 for (let i = 0; i < newChurchNameAndContacts.contacts.length; i += 1) {
//                     contactsAndChurches[newChurchNameAndContacts.contacts[i]]
//                         .foundChurch = res.data[0]._id;
//                 }

//                 /* foundChurches.push({
//                     'foundChurchName': res.data[0].title,
//                     'foundChurch': res.data[0]._id,
//                     'contacts': newChurchNameAndContacts.contacts
//                 }); */
//             }

//             next();
//         })
//         .catch((err) => next(err));
// }

// // Callback function — after all iterations are finished
// function searchForChurchCallback(err) {
//     if (err) {
//         const errorMessage = $fluro.utils.errorMessage(err);
//         return done(errorMessage, 'STOP');
//     }

//     // Return results
//     // input.foundChurches = foundChurches;

//     return done(null, input);
// }

// // Function to execute on each contact
// function createChurch(newChurchName, index, next) {
//     const body = {
//         // 'definition': 'church',
//         title: newChurchName,
//         realms: ['61f546264d66c70018d73006']
//     };

//     // https://api.fluro.io/content/:type
//     $fluro.api.post('/content/church', body, headers)
//         .then((res) => {
//             createdNewChurch.push(Object.keys(res)); /* newChurchName */

//             next();
//         })
//         .catch((err) => next(err));
// }

// // Callback function — after all iterations are finished
// function createChurchCallback(err) {
//     if (err) {
//         const errorMessage = $fluro.utils.errorMessage(err);
//         return done(errorMessage, 'STOP');
//     }

//     // Return results
//     input.newChurchNamesToCreate = newChurchNamesToCreate;
//     input.createdNewChurch = createdNewChurch;
//     return done(null, input);
// }

// // Run the async function
// return async.forEachOfSeries(newChurchNamesAndContacts,
// searchForChurch, searchForChurchCallback);

// // return forEachOfSeries(newChurchNamesToCreate, createChurch, createChurchCallback);
