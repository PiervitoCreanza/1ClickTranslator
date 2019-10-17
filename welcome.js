const clipboardWatcher = require('electron-clipboard-watcher')
const {ipcRenderer} = require('electron')

const watcher = clipboardWatcher({
    // (optional) delay in ms between polls
    watchDelay: 1000,
    // handler for when text data is copied into the clipboard
    onTextChange: function (text) {
        let splittedText = text.split(' ')
        if (splittedText.length <= 1 && text.length <= 20) {
            ipcRenderer.send('copied', text)
        } else {
            // Very long sentence
            console.log('It\'s way too long!!')
        }
        
    }
})