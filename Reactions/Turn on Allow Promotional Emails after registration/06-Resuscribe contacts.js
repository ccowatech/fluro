/*
Re-subscribe people to Allow Promotional Emails
*/

// Get input into variables
var contacts = input.contacts;
var emailsToSubscribe = [];

// Set up request headers
const headers = {"Content-Type": "application/json; charset=utf-8"};

// Set up results objects
const results = [];

// Build array of emails to process. All the email addresses for a contact must be resubscribed for the Allow Promotional Emails setting to turn on.
for(let i=0; i<contacts.length; i++) {
    for(let j=0; j<contacts[i].emails.length; j++) {
        emailsToSubscribe.push(contacts[i].emails[j]);
    }
}

let body = { "emails": emailsToSubscribe };

return $fluro.api.post("/mailout/resubscribe", body, headers)
.then(function(res) {
    results.push(res.data);

    // Return results
    input.results = results;
    return done(null, input);
}, done);
