/*
Set email variables based on Realm
*/

let fromEmail;
let fromNameFull;
let fromNameShort;

if (input.formRealm.definition === 'convention') {
    fromEmail = input.formRealm.data.registrarEmail;
    fromNameFull = input.formRealm.title;
    fromNameShort = input.formRealm.data.shortTitle;
} else {
    fromEmail = 'bookkeeper@ccowa.org';
    fromNameFull = 'Christian Conventions of Western Australia';
    fromNameShort = 'CCOWA';
}

// Add contact email to input
delete input.formRealm;
input.fromEmail = fromEmail;
input.fromNameFull = fromNameFull;
input.fromNameShort = fromNameShort;

// Finish the action and send the input to the next action
return done(null, input);
