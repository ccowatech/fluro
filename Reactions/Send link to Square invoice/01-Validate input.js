/*
This Reaction automatically sends a link to the
Square Invoice to the first contact whenever a form is
filled out.
*/

/*
Validate input
*/

var inputType;

if(input.trigger == "manual.spark" && input.data["_type"] == "interaction") {
    inputType = "manualInteraction";
} else if (input.trigger == "content.create" && input.data["_type"] == "interaction") {
    inputType = "autoInteraction";
} else {
    // Unknown input. Stop the Reaction
    return done(null, 'STOP');
}


input.inputType = inputType;

// Finish the action and send the input to the next action
return done(null, input);
