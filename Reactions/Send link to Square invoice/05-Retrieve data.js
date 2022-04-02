/*
Retrieve the required data
*/

// Load packages
const _ = require('lodash');

// Get input we need
const { interaction, inputType } = input;

// Check that a Transaction and a Contact are attached to this Interaction.
if (!_.has(interaction, 'transactions') || !_.has(interaction, 'contacts')) {
    // If there's no transaction or contact, stop the Reaction
    return done(null, 'STOP');
}

// Find all the data needed for the next steps
const {
    receiptUrl,
    cardDetails: { statementDescription }
} = interaction.transactions[0].transactionData.payment;

const { title: formTitle, realms: formRealms } = interaction;
const formRealm = formRealms[0];

const interactionLink = `https://app.fluro.io/list/interaction/${interaction.definition}/${input.interaction._id}/edit`;
const transactionLink = `https://app.fluro.io/list/transaction/${interaction.transactions[0]._id}/edit`;
const contact = interaction.contacts[0];

// Format input nicely for next steps
input = {
    formTitle,
    formRealm,
    receiptUrl,
    statementDescription,
    interactionLink,
    transactionLink,
    contact,
    inputType
};

// Finish the action and send the input to the next action
return done(null, input);
