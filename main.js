const {app, BrowserWindow} = require('electron');

let win;

function createWindow () {
  win = new BrowserWindow({width: 991, height: 655});

  // TODO: use this to remove the menubar and resize the BrowserWindow height to 655
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