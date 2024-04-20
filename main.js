import { app, BrowserWindow } from 'electron';
import { join } from 'path';

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: join('./assets/icon.png'),
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});