/*
Put tickets under each contact
*/

let interaction = input.interaction;
let primaryContact = input.primaryContact;
let secondaryContacts = input.secondaryContacts;
let tickets = input.tickets[0];

// If no tickets, stop the Reaction
if(tickets.length < 1) {
    return done(null, "STOP");
}

// Put tickets under each contact
for (let i=0; i<tickets.length; i++) {

    if(tickets[i].status == "active" && tickets[i].hasOwnProperty("event")) { // If the ticket is active and there is an associated event

        if(secondaryContacts.hasOwnProperty(tickets[i].contact._id)) { // If the contact is a secondary contact

            // If the contact does not already have a ticket array, create it
            if(!secondaryContacts[tickets[i].contact._id].hasOwnProperty("tickets")) {
                secondaryContacts[tickets[i].contact._id].tickets = [];
            }

            // Add the ticket to the contact's ticket array
            secondaryContacts[tickets[i].contact._id].tickets.push({
                 "_id": tickets[i]._id,
                "title": tickets[i].title,
                "event": {
                    "_id": tickets[i].event._id,
                    "title": tickets[i].event.title,
                    "startDate": tickets[i].event.startDate,
                    "endDate": tickets[i].event.endDate
                }
            });
        }
    }
}


// Return the data
input = {};

input.interaction = interaction;
input.primaryContact = primaryContact;
input.secondaryContacts = secondaryContacts;

return done(null, input);
