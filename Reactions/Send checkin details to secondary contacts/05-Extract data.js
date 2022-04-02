/*
Extract the data we need.
*/

// Load packages
const _ = require('lodash');

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

if (!_.has(interaction.rawData, 'contact')) {
    // If no contacts attached to this interaction, stop the Reaction
    return done(null, 'STOP');
}

for (let i = 0; i < interaction.rawData.contact.length; i += 1) {
    const thisContactID = interaction.data.contact[i];
    const thisContactData = interaction.rawData.contact[i];

    if (interaction.rawData.contact[i].email === interaction.primaryEmail) {
        primaryContact = {
            _id: thisContactID,
            firstName: thisContactData.firstName,
            lastName: thisContactData.lastName,
            email: thisContactData.email
        };
    } else {
        secondaryContacts[thisContactID] = {
            _id: thisContactID,
            firstName: thisContactData.firstName,
            lastName: thisContactData.lastName,
            email: thisContactData.email
        };
    }
}

if (secondaryContacts.length === 0) { // No secondary contacts. This Reaction is not needed.
    return done(null, 'STOP');
}

input = {
    interaction: formattedInteraction,
    primaryContact,
    secondaryContacts
};

return done(null, input);
