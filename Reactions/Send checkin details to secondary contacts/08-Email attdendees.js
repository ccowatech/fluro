/*
Email each extra attendee with ticket details
*/


//Load packages
var _ = require('lodash');
var async = require('async');

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results structures to return info to the next step]
const results = [];

// Get input data needed
let interaction = _.get(input, 'interaction');
let primaryContact = _.get(input, 'primaryContact');
let secondaryContacts = _.get(input, 'secondaryContacts');

let ticketURL = `http://tickets.fluro.io/interaction/${interaction._id}`;
let interactionURL = `https://app.fluro.io/list/interaction/${interaction.definition}/${interaction._id}/edit`;

// Run the async function
return async.forEachOfSeries(secondaryContacts, emailTicketInfo, emailTicketInfoCallback);

// Function to execute on each contact
function emailTicketInfo(contact, index, next) {

    let eventList = "";

    for(let i=0; i<contact.tickets.length; i++) {

        let startDateObject = new Date(contact.tickets[i].event.startDate);
        let startDateString = startDateObject.toLocaleString('en-AU', {dateStyle: "long", timeStyle: "short", timeZone: "Australia/Perth"});

        eventList = eventList + `<h3>${contact.tickets[i].event.title}</h3>
            <p>${contact.tickets[i].title}</p>
            <p>${startDateString}</p>`;
    }

    let emailBody = `
    <div style="text-align: center;">
        <h1>${interaction.realm.shortTitle} check-in details</h1>
        <hr/>
        <img src="https://api.fluro.io/system/qr?input=${ticketURL}" style="border: 10px solid black; border-radius: 10px;" width="150px"/>
        <h3>${contact.firstName} ${contact.lastName}</h3>
        <p>${contact.email}</p>
        <hr/>
        ${eventList}
        <hr/>
    </div>
    <div style="text-align: left;">
        <p>The payment receipt and full registration details have been sent to ${primaryContact.firstName} ${primaryContact.lastName} (${primaryContact.email}).</p>
        <h4>Need help?</h4>
        <p>Reply to this email, or contact us at <a href="mailto:${interaction.realm.email}?subject=${interaction.realm.title} enquiry">${interaction.realm.email}.</p>
        <hr/>
        <p><small>Christian Conventions of Western Australia<br/>
        ABN 38 223 904 915<br/></small></p>
        <p style="color:#AAA;"><small>
        Admin links: <a href="${interactionURL}">Form submission</a></small></p>
    </div>`;

    let body = {
    	"fromName": interaction.realm.title,
    	"fromEmail": interaction.realm.email,
    	"toEmails": contact.email,
    	//"toContactIDs": [""],
    	"subject": `${interaction.realm.shortTitle} check-in details`,
    	"body": emailBody
    };

    let emailReactionID = "621dfa141b17ad02986c7d78";

    // POST https://api.fluro.io/reaction/spark/:reactionID
    $fluro.api.post(`/reaction/spark/${emailReactionID}`,body,headers)
    .then(res => {
        results.push(res.data);
        next();
    })
    .catch(err => next(err));
}

// Callback function — after all iterations are finished
function emailTicketInfoCallback(err) {
    if (err) {
        var errorMessage = $fluro.utils.errorMessage(err);
        return done(errorMessage, "STOP");
    }

	// Return results
	return done(null, input);
}
