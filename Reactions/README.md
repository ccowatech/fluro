# Reactions

Code for Fluro Reactions.

## Directory format
Each directory has:
- A `<Reaction name>.json` file with the complete Reaction JSON
- A `README.md` file with basic information and links to further info
- Javascript (`.js`) or Embedded Javascript (`.ejs`) files for each custom code or email step in the Reaction with file name convention `<Reaction step>`-`<Step title>`.`<js/ejs>`. *Example: `04-Add Contact to Realm.js`*
