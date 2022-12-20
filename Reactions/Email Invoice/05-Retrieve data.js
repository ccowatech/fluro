/*
Retrieve the required data
*/

// Load packages
const has = require('lodash/has');
const startCase = require('lodash/startCase');

// Get input we need
const { interaction, inputType } = input;
const { paymentModifiers } = interaction;

// Check that a Transaction and a Contact are attached to this Interaction.
if (!has(interaction, 'transactions') || !has(interaction, 'contacts')) {
    // If there are no transactions or no contacts, stop the Reaction
    return done(null, 'STOP');
}

const { integration: { module }, transactionData } = interaction.transactions[0];

const integrationModule = startCase(module);

let paymentInfo;
let totalMoney;
let receiptUrl;
let statementDescription;

// Get data from the right places depending on which payment processor the form used
switch (integrationModule) {
case 'Square':
    paymentInfo = transactionData.payment;

    totalMoney = paymentInfo.totalMoney.amount;
    receiptUrl = paymentInfo.receiptUrl;
    statementDescription = paymentInfo.cardDetails.statementDescription;

    break;

case 'Stripe':
    paymentInfo = transactionData;

    totalMoney = interaction.transactions[0].total;
    receiptUrl = paymentInfo.receipt_url;
    statementDescription = paymentInfo.calculated_statement_descriptor;

    break;

    // Other payment processors could be added in here in the future

default:
    // Not a payment processor supported by this Reaction
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
    integrationModule,
    receiptUrl,
    statementDescription,
    interactionLink,
    transactionLink,
    contact,
    inputType,
    paymentModifiers,
    totalMoney
};

// Finish the action and send the input to the next action
return done(null, input);
