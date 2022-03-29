/*
Re-subscribe people to Allow Promotional Emails
*/

// Get input into variables
const contacts = input.contacts;
const emailsToSubscribe = [];

// Set up request headers
const headers = { 'Content-Type': 'application/json; charset=utf-8' };

// Set up results objects
const results = [];

// Build array of emails to process.
// All the email addresses for a contact must be resubscribed
// for the Allow Promotional Emails setting to turn on.
for (let i = 0; i < contacts.length; i += 1) {
    for (let j = 0; j < contacts[i].emails.length; j += 1) {
        emailsToSubscribe.push(contacts[i].emails[j]);
    }
}

const body = { emails: emailsToSubscribe };

return $fluro.api.post('/mailout/resubscribe', body, headers)
    .then((res) => {
        results.push(res.data);

        // Return results
        input.results = results;
        return done(null, input);
    }, done);
