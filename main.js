const { app, BrowserWindow } = require('electron')
const path = require('path')
const sys = process.platform

let win

function createWindow () {
  win = new BrowserWindow({
    width: sys === 'darwin' || sys === 'win32' ? 990 : 975,
    height: sys === 'darwin' || sys === 'win32' ? 655 : 620,
    icon: getPlatformIcon('icon')
  })
  
  win.setMenu(null);
  win.loadFile('index.html');
  // win.webContents.openDevTools() // Dubugging

  win.on('closed', () => {
    win = null
  })
}

function getPlatformIcon(filename) {
  sys === 'win32' ? filename = filename + '.ico'
  : sys === 'darwin' ? filename = filename + '.icns'
  : filename = filename + '.png'

  return path.join(__dirname, 'build', filename)
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
