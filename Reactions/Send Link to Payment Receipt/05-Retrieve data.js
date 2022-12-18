/*
Retrieve the required data
*/

// Load packages
const has = require('lodash/has');

// Get input we need
const { interaction, inputType } = input;

// Check that a Transaction and a Contact are attached to this Interaction.
if (!has(interaction, 'transactions') || !has(interaction, 'contacts')) {
    // If there are no transactions or no contacts, stop the Reaction
    return done(null, 'STOP');
}

const { integration } = interaction.transactions[0];
let integrationName;
let transactionData;
let receiptUrl;
let statementDescription;

// Get data from the right places depending on which payment processor the form used
switch (integration) {
case '61f00157bb22cf00141a8170': // Square
    integrationName = 'Square';

    transactionData = interaction.transactions[0].transactionData.payment;

    receiptUrl = transactionData.receiptUrl;
    statementDescription = transactionData.cardDetails.statementDescription;

    break;

case '638311a5b304c1002553dd2b': // Stripe
    integrationName = 'Stripe';

    transactionData = interaction.transactions[0].transactionData;

    receiptUrl = transactionData.receipt_url;
    statementDescription = transactionData.calculated_statement_descriptor;

    break;

default:
    // Unknown
    integrationName = 'Unknown';
}

// Get remaining data needed for the next steps
const { title: formTitle, realms: formRealms } = interaction;
const formRealm = formRealms[0];

const interactionLink = `https://app.fluro.io/list/interaction/${interaction.definition}/${input.interaction._id}/edit`;
const transactionLink = `https://app.fluro.io/list/transaction/${interaction.transactions[0]._id}/edit`;
const contact = interaction.contacts[0];

// Format input nicely for next steps
input = {
    formTitle,
    formRealm,
    integration,
    integrationName,
    receiptUrl,
    statementDescription,
    interactionLink,
    transactionLink,
    contact,
    inputType
};

// Finish the action and send the input to the next action
return done(null, input);
