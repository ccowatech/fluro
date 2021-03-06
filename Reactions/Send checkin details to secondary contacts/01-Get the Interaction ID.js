/*
Get the interaction ID
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

// Replace input with only the data we need
input = {
    inputType,
    interaction
};

return done(null, input);
