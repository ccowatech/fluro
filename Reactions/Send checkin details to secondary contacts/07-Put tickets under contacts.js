/*
Put tickets under each contact
*/

const interaction = input.interaction;
const primaryContact = input.primaryContact;
const secondaryContacts = input.secondaryContacts;
const tickets = input.tickets[0];

// If no tickets, stop the Reaction
if (tickets.length < 1) {
    return done(null, 'STOP');
}

// Put tickets under each contact
for (let i = 0; i < tickets.length; i += 1) {
    // If the ticket is active and there is an associated event
    if (tickets[i].status === 'active' && tickets[i].hasOwnProperty('event')) {
        // If the contact is a secondary contact
        if (secondaryContacts.hasOwnProperty(tickets[i].contact._id)) {
            // If the contact does not already have a ticket array, create it
            if (!secondaryContacts[tickets[i].contact._id].hasOwnProperty('tickets')) {
                secondaryContacts[tickets[i].contact._id].tickets = [];
            }

            // Add the ticket to the contact's ticket array
            secondaryContacts[tickets[i].contact._id].tickets.push({
                _id: tickets[i]._id,
                title: tickets[i].title,
                event: {
                    _id: tickets[i].event._id,
                    title: tickets[i].event.title,
                    startDate: tickets[i].event.startDate,
                    endDate: tickets[i].event.endDate
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
