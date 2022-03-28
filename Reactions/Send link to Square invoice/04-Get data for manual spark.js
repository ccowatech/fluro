/*
Retrieve the required data
*/

const interaction = input.interaction;

// Check that a Transaction and a Contact are attached to this Interaction.
const transactionExists = interaction.hasOwnProperty('transactions');
const contactExists = interaction.hasOwnProperty('contacts');

// If there's no transaction or contact, stop the Reaction
if (transactionExists === false || contactExists === false) {
    return done(null, 'STOP');
}

// Find all the data needed for the next steps
const inputType = input.inputType;
const formTitle = interaction.title;
const formRealm = interaction.realms[0];
const receiptUrl = interaction.transactions[0].transactionData.payment.receiptUrl;
const statementDescription = interaction.transactions[0].transactionData.payment.cardDetails.statementDescription;
const interactionLink = `https://app.fluro.io/list/interaction/${interaction.definition}/${input.interaction._id}/edit`;
const transactionLink = `https://app.fluro.io/list/transaction/${interaction.transactions[0]._id}/edit`;
const contact = interaction.contacts[0];

// Format input nicely for next steps
input = {};
input.formTitle = formTitle;
input.formRealm = formRealm;
input.receiptUrl = receiptUrl;
input.statementDescription = statementDescription;
input.interactionLink = interactionLink;
input.transactionLink = transactionLink;
input.contact = contact;
input.inputType = inputType;

// Finish the action and send the input to the next action
return done(null, input);