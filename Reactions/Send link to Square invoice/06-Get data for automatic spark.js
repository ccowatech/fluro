/*
Get and format data for automatic spark on form submission
*/

// Check that a Transaction and a Contact are attached to this Interaction.
var transactionExists = input.data.submittedData.hasOwnProperty('transactions');
var contactExists = input.data.submittedData.hasOwnProperty('contacts');

// If there's no transaction or contact, stop the Reaction
if(transactionExists === false || contactExists === false) {
    return done(null, 'STOP');
}

// Find all the data needed for the next steps
var inputType = input.inputType;
var formTitle = input.data.submittedData.title;
var formRealm = input.data.submittedData.realms[0];
var receiptUrl = input.data.submittedData.transaction.transactionData.payment.receiptUrl;
var statementDescription = input.data.submittedData.transaction.transactionData.payment.cardDetails.statementDescription;
var interactionLink = 'https://app.fluro.io/list/interaction/' + input.data.definition + '/' + input.item + '/edit';
var transactionLink = 'https://app.fluro.io/list/transaction/' + input.data.submittedData.transaction["_id"] + '/edit';
var contact = input.data.submittedData.contacts[0];

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
