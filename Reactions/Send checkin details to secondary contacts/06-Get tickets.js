/*
Get tickets related to these contacts and this interaction
*/

// Set up results structures to return info to the next step]
const tickets = [];

// Get input data needed
const { interactionID } = input;

/*
GET https://api.fluro.io/tickets/:connection/:connectionID
DESCRIPTION
Returns an array of all tickets connected to a specified content item.

Options are
/tickets/interaction/<INTERACTIONID>
/tickets/contact/<CONTACTID>
/tickets/event/<EVENTID>
*/
$fluro.api.get(`/tickets/interaction/${interactionID}`)
    .then((res) => tickets.push(res.data))
    .catch((err) => done(err, 'STOP'));

// Return results
input.tickets = tickets;

return done(null, input);
