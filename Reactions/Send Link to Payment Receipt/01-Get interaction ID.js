/*
This Reaction automatically sends a link to the receipt provided
by payment processors to the first contact whenever a form is
filled out.
*/

/*
Get Interaction ID
*/

let inputType;
let interaction;

if (input.trigger === 'manual.spark' && input.data._type === 'interaction') {
    inputType = 'manualInteraction';
    interaction = input.item._id;
} else if (input.trigger === 'content.create' && input.data._type === 'interaction') {
    inputType = 'autoInteraction';
    interaction = input.item;
} else {
    inputType = 'unknown';
}

// Clear input and put back what we need
input = {};
input.interaction = interaction;
input.inputType = inputType;

// Finish the action and send the input to the next action
return done(null, input);
