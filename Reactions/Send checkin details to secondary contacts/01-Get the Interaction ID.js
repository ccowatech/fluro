/*
Get the interaction ID
*/

let inputType;
let interaction;

if(input.hasOwnProperty("item")) {
    if(input.item._type == "interaction") {
        inputType = "AutoInteraction";

        interaction = input.item._id;
    }
} else if (input.hasOwnProperty("_type")) {
    if(input._type == "interaction") {
        inputType = "ManualInteraction";

        interaction = input._id;
    }
} else { // Input type is invalid
    inputType = "unknown";
}

input = {};
input.inputType = inputType;
input.interaction = interaction;

return done(null, input);
