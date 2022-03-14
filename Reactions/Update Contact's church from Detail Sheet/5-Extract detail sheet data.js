/*
Extract data from detail sheets that we need, clear the rest
*/

var detailSheets = input.detailSheets;
var contactsAndChurches = {};

var contacts = input.contacts;

for(let i = 0; i < detailSheets.length; i++) {

    if(detailSheets[i].definition == "churchDetails" && detailSheets[i].status == "active") { // Filter out all the non-churchDetails sheets inactive church detail sheets

        contactsAndChurches[detailSheets[i].contact] = {
            "contact": detailSheets[i].contact,
            "detailSheet": detailSheets[i]._id,
            "attendsChurch": detailSheets[i].data.attendsChurch
        }


         if(detailSheets[i].data.hasOwnProperty("churchAttending")) {
             if(detailSheets[i].data.churchAttending != null) {
                 if(detailSheets[i].data.churchAttending.hasOwnProperty("_id")) {
                     contactsAndChurches[detailSheets[i].contact].churchOnDetailSheet = detailSheets[i].data.churchAttending._id; // In case churchAttending is an object with an ID
                 } else {
                     contactsAndChurches[detailSheets[i].contact].churchOnDetailSheet = detailSheets[i].data.churchAttending; // In case churchAttending is a string containing the ID
                 }
             }
         }
         if(detailSheets[i].data.hasOwnProperty("churchNotListedName") && detailSheets[i].data.hasOwnProperty("churchIsNotListed")) {
             if(detailSheets[i].data.churchIsNotListed == true) {
                 contactsAndChurches[detailSheets[i].contact].churchIsNotListed = detailSheets[i].data.churchIsNotListed;
                 contactsAndChurches[detailSheets[i].contact].churchNotListedName = detailSheets[i].data.churchNotListedName;
             }
         }
    }
}

// Clear the input and put back what we want
input = {};
input.contacts = contacts;
input.contactsAndChurches = contactsAndChurches;

return done(null, input);
