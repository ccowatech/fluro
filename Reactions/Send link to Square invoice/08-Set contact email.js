/*
Set contact email
*/

var contactEmail;

if(input.formRealm.definition =="convention") {
    contactEmail = input.formRealm.data.registrarEmail;
} else {
    contactEmail = "bookkeeper@ccowa.org";
}

// Add contact email to input
delete input["formRealm"];
input.contactEmail = contactEmail;

// Finish the action and send the input to the next action
return done(null, input)
