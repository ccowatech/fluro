/*
This Reaction is called from other Reactions to send emails.

Example body input:

{
    "fromName": "Rhianon Rae",
    "fromEmail": "rhianonrae@gmail.com",
    "toEmails": "samrae@gmail.com",
    "toContactIDs": ["5e97e0806a9f734dcdc940f1"],
    "subect": "Test email",
    "body": "<h3>Hi!</h3><p>Here is a test email</p>"
}
*/

/*
Validate input
*/
if(!input.fromName) return done('No from name supplied','STOP');
if(!input.fromEmail) return done('No from email address supplied','STOP');
if(!input.toEmails && !input.toContactIDs) return done('No contact IDs or email addresses supplied','STOP');
if(!input.subject) return done('No email subject supplied','STOP');
if(!input.body) return done('No email body supplied','STOP');

// Supply defaults if they're not there
if (!input.toContactIDs) input.toContactIDs = null;
if (!input.toEmails) input.toEmails = null;

return done(null, input);
