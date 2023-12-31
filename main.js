const {app, BrowserWindow, ipcMain} = require('electron')
const windowStateKeeper = require('electron-window-state')
const readItem = require('./readItem')
const appMenu = require("./menu")
const updater = require("./updater")

let mainWindow

// Listen for new item request
ipcMain.on('new-item', (e, itemUrl) => {
    
    // Get new item and send back to renderer
    readItem(itemUrl, item => {
        e.sender.send('new-item-success', item)
    })
})

function createWindow () {

  // Check for updates
  setTimeout(updater, 1500)

  // Win state keeper
  let state = windowStateKeeper({
    defaultWidth: 500, defaultHeight: 650
  })

  mainWindow = new BrowserWindow({
    x: state.x, y: state.y,
    width: state.width, height: state.height,
    minWidth: 350, maxWidth: 650, minHeight: 300,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Create main app menu
  appMenu(mainWindow.webContents)

  mainWindow.loadFile('renderer/main.html')

  state.manage(mainWindow)

  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
