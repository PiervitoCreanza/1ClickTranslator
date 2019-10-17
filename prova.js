var { translate } = require("google-translate-api-browser");
const util = require('util');

translate = util.promisify(translate)

async function showDefinition(word, sn, dn) {
    cambridge.default(word)
        .then(result => {

            cambridgeDefinition = result // Set as global

            definitionsNumber = cambridgeDefinition.senses[sn].definitions.length - 1 // The first element of a list is 0, so we do -1
            sensesNumber = cambridgeDefinition.senses.length - 1    // The first element of a list is 0, so we do -1

            console.log(cambridgeDefinition)

            // Show data on the page
            typeHTML.innerText = cambridgeDefinition.senses[sn].type
            cambridgeDefinitionResult = cambridgeDefinition.senses[sn].definitions[dn]
            wordHTML.innerText = capitalize(word)  
            if (!cambridgeDefinitionResult.level) {
                levelHTML.style.display = "none";
            } else {
                levelHTML.style.display = "inline-block";
                levelHTML.innerText = cambridgeDefinitionResult.level
            }                      
            
            exampleHTMl.innerText = capitalize(cambridgeDefinitionResult.examples[0])
            definitionHTMl.innerText = capitalize(cambridgeDefinitionResult.definition)
            ipcRenderer.send('show-me')
        });
};