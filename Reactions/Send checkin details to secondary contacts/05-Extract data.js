/*
Extract the data we need.
*/

// Load packages
const has = require('lodash/has');

// Get interaction info
const { interaction } = input;
const interactionRealm = interaction.realms[0];

const formattedInteraction = {
    _id: interaction._id,
    definition: interaction.definition,
    realm: {
        title: interactionRealm.title,
        shortTitle: interactionRealm.data.shortTitle,
        email: interactionRealm.data.registrarEmail
    }
};

// Get contact info
let primaryContact;
const secondaryContacts = {};

if (!has(interaction.rawData, 'contact')) {
    // If no contacts attached to this interaction, stop the Reaction
    return done(null, 'STOP');
}

// Sanitises email addresses
// - puts to lower case
// - strips leading and trailing whitespace
function sanitiseEmail(email) {
    return email.toLowerCase().trim();
}

// Loop through all the contacts
for (let i = 0; i < interaction.rawData.contact.length; i += 1) {
    const thisContactID = interaction.data.contact[i];
    const thisContactData = interaction.rawData.contact[i];

    // If the current contact has an email address, see if it matchces the primary contact
    if (has(thisContactData, 'email')) {
        // If primary contact, set primary contact data
        if (sanitiseEmail(thisContactData.email) === sanitiseEmail(interaction.primaryEmail)) {
            primaryContact = {
                _id: thisContactID,
                firstName: thisContactData.firstName,
                lastName: thisContactData.lastName,
                email: thisContactData.email
            };
        // If secondary contact, add to secondary contacts array
        } else {
            secondaryContacts[thisContactID] = {
                _id: thisContactID,
                firstName: thisContactData.firstName,
                lastName: thisContactData.lastName,
                email: thisContactData.email
            };
        }
    }
}

// If no secondary contacts with email addresses
if (Object.keys(secondaryContacts).length === 0) {
    // Stop the Reaction, because it is not needed
    return done(null, 'STOP');
}

input = {
    interaction: formattedInteraction,
    primaryContact,
    secondaryContacts
};

return done(null, input);
