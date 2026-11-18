import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const sys = process.platform;

let win: BrowserWindow | null;

function createWindow(): void {
  win = new BrowserWindow({
    width: sys === 'darwin' || sys === 'win32' ? 990 : 975,
    height: sys === 'darwin' || sys === 'win32' ? 655 : 620,
    icon: getPlatformIcon('icon')
  });
  
  win.setMenu(null);
  win.loadFile('index.html');
  // win.webContents.openDevTools() // Debugging

  win.on('closed', () => {
    win = null;
  });
}

function getPlatformIcon(filename: string): string {
  let iconFilename: string;
  if (sys === 'win32') {
    iconFilename = filename + '.ico';
  } else if (sys === 'darwin') {
    iconFilename = filename + '.icns';
  } else {
    iconFilename = filename + '.png';
  }

  return path.join(__dirname, '..', 'build', iconFilename);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});