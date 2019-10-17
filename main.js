const { ipcMain, app, BrowserWindow } = require('electron')
const fs = require('fs');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 650,
    resizable: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('src/pages/welcome.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

function createDefinition () {
  // Create the browser window.
  definition = new BrowserWindow({
    width: 500,
    height: 650,
    show: false,
    //resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  definition.loadFile('src/pages/definition.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  definition.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    definition = null
  })

}

function createDictionary () {
  dictionary = new BrowserWindow({
    width: 500,
    height: 650,
    show: true,
    //resizable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true
    }
  })
  // and load the index.html of the app.
  dictionary.loadFile('src/pages/dictionary.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  dictionary.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    dictionary = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



// Declaration of word as global
var word

// When welcome page is open we receive the copied word
ipcMain.on('copied', (event, text) => {
  createDefinition()
  word = text
  console.log('<----->\nYou searched the word:')
  console.log(word) 
});

ipcMain.on('on', () => {
  console.log('ready')
  definition.webContents.send('word', word)
})

ipcMain.once('show-me', () => {
  console.log("mostro")
  definition.show()
  win.close()
})

ipcMain.on('save', (event, args) => {
  original = args.original
  translation = args.translation

  fs.readFile('dictionary.json', function (err, data) {
    var json = JSON.parse(data)
    var dict = json.dictionary.words
    duplicate = false
    for (let key in dict) {
        if (dict.hasOwnProperty(key)) {
            if (dict[key].original == original) {
                console.log('word already present');
                duplicate = true
                break          
            }
        }      
    } 
    
    if (!duplicate) {
        console.log('not present')
        json.dictionary.words.push({original: original, translation: translation})
        json = JSON.stringify(json)
        fs.writeFile("dictionary.json", json, () => {createDictionary()})
    }
  })
})
