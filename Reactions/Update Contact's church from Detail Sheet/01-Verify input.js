/*
This Reaction removes a Contact from previous churches
(Groups) and adds them to their current church as defined
by their current churchDetails detail sheet.

It sparks automatically:
- on form submissions (Interactions)
  When registration forms are submitted with an attached
  detail sheet, the detail sheet is updated by Fluro,
  and then this Reaction picks up the data from the detail
  sheet (not from the form data itself)
- on creation or editing of a churchDetails details sheet

It can be sparked manually on:
- churchDetails detail sheets

Info:
- This doesn't actually use any information from the form submission apart from the contact IDs.
All the detail sheet information is picked up from the current detail sheet as it is in Fluro.

*/

/*
Verify input
*/

let inputType;

// Check what sort of input we have
if (input.item.definition === 'churchDetails' || input.model === 'contactdetail') {
    inputType = 'detailSheet';
} else if (input.data._type === 'interaction') {
    inputType = 'interaction';
} else {
    inputType = 'unknown';
    return done(null, 'STOP');
}

input.inputType = inputType;

return done(null, input);
