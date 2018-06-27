const {app, BrowserWindow} = require('electron');

let win;

function createWindow () {
  win = new BrowserWindow({width: 974, height: 640}); // MAC OS optimal Size
  // win = new BrowserWindow({width: 991, height: 655); // Windows optimal Size
  
  // win.setMenu(null);
  win.loadFile('index.html');

  // win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
});