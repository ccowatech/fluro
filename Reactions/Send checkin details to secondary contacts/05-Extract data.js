/*
Extract the data we need.
*/

// Get interaction info
let interaction = {
    "_id": input.interaction._id,
    "definition": input.interaction.definition,
    "realm": {
        "title": input.interaction.realms[0].title,
        "email": input.interaction.realms[0].data.registrarEmail
    }
};

// Get contact info
let primaryContact;
let secondaryContacts = {};

for(let i=0; i<input.interaction.rawData.contact.length; i++) {
    if(input.interaction.rawData.contact[i].email == input.interaction.primaryEmail) {

        primaryContact = {
            "_id": input.interaction.data.contact[i],
            "firstName": input.interaction.rawData.contact[i].firstName,
            "lastName": input.interaction.rawData.contact[i].lastName,
            "email": input.interaction.rawData.contact[i].email
        };

    } else {

        secondaryContacts[input.interaction.data.contact[i]] = {
            "_id": input.interaction.data.contact[i],
            "firstName": input.interaction.rawData.contact[i].firstName,
            "lastName": input.interaction.rawData.contact[i].lastName,
            "email": input.interaction.rawData.contact[i].email
        };
    }
}

if(secondaryContacts.length == 0) { // No secondary contacts. This Reaction is not needed.
    return done(null, 'STOP');
}

input = {};

input.interaction = interaction;
input.primaryContact = primaryContact;
input.secondaryContacts = secondaryContacts;

return done(null, input);
