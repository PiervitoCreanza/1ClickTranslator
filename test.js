const clipboardWatcher = require('electron-clipboard-watcher')
var { translate } = require("google-translate-api-browser");
var definitionHTMl = document.getElementById('definition');
var exampleHTMl = document.getElementById('example');
var levelHTML = document.getElementById('level');
var typeHTML = document.getElementById('type');
var wordHTML = document.getElementById('word');
var cambridge = require('/Users/Piervito/Desktop/Programmazione/1ClickTranslation/node_modules/sata-cambridge-dictionary/index.js');
const {ipcRenderer} = require('electron')

// Declaration of sn (definition number) and word as global variables
var sn
var dn
var word
var newWord
var cambridgeDefinition
var translation
var definitionsNumber
var sensesNumber


ipcRenderer.send('on')

ipcRenderer.on('word', (event, word) => {
    sn = 0
    dn = 0
    showNotification(word, sn, dn);
    console.log('hello')
    
})

capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}


// Check for clipboard words
const watcher = clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 1000,
    // handler for when text data is copied into the clipboard
    onTextChange: function (clipBoardText) {
        word = clipBoardText // Global variable
        newWord = true 
        let splittedText = word.split(' ')
        if (splittedText.length <= 1 && word.length <= 20) {
            sn = 0
            dn = 0
            showNotification(word, sn, dn);
        } else {
            // Very long sentence
            console.log('It\'s way too long!!')
        }
        
    }
})




async function showDefinition(word, sn, dn) {
    try {
        cambridgeDefinition = await cambridge.default(word) // Global
        console.log(cambridgeDefinition)
        console.log(sn)

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
    } catch (error) {
        throw(error)
    }
}

async function showNotification(word, sn, dn) {
    try {
        translation = await translate(word, { from: 'auto', to: "it" })
        translation = translation.text
        myNotification = new Notification(translation, {
            body: `E' la traduzione di ${word}`,
            silent: true,
        })
        showDefinition(word, sn, dn);
    } catch (error) {
        myNotification = new Notification('Si è verificato un errore!', {
            body: `Errore nella traduzione di ${word}`,
            })
        throw(error)        
    }
}



function next() {     
    if (definitionsNumber > dn) {
        dn += 1
        showDefinition(word, sn, dn)
        console.log(`Showing definition ${dn+1} of ${definitionsNumber+1} total meanings.`)
    } else {
        if (sensesNumber > sn) {
            dn = 0
            sn += 1
            showDefinition(word, sn, dn)
            console.log(`Showing sense ${sn+1} of ${sensesNumber+1} total senses.`)
        } else {
            console.log('you read all the definitions!')
        }        
    }    
};

function save() {
    if (newWord) {
        ipcRenderer.send('save', {original: word, translation: translation})
        newWord = false
    } else {
        console.log('already saved')
    }
    
}



