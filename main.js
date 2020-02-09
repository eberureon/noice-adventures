const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 975,
    height: 620,
    icon: path.join(__dirname + '/images/logo.png'),
  });
  
  win.setMenu(null);
  win.loadFile('index.html');

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
