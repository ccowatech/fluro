/*
Get and format data for Manual Spark in an Interaction
*/

// Check that a Transaction and a Contact are attached to this Interaction.
var transactionExists = input.item.hasOwnProperty('transactions');
var contactExists = input.item.hasOwnProperty('contacts');

// If there's no transaction or contact, stop the Reaction
if(transactionExists === false || contactExists === false) {
    return done(null, 'STOP');
}

// Find all the data needed for the next steps
var inputType = input.inputType;
var formTitle = input.item.title;
var formRealm = input.item.realms[0];
var receiptUrl = input.item.transactions[0].transactionData.payment.receiptUrl;
var statementDescription = input.item.transactions[0].transactionData.payment.cardDetails.statementDescription;
var interactionLink = 'https://app.fluro.io/list/interaction/' + input.item.definition + '/' + input.item["_id"] + '/edit';
var transactionLink = 'https://app.fluro.io/list/transaction/' + input.item.transactions[0]["_id"] + '/edit';
var contact = input.item.contacts[0];

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
