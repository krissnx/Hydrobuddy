const { app, BrowserWindow } = require('electron');
const path = require('path');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 700,
        height: 600,
        useContentSize: true,
        webPreferences: {
            nodeIntegration: true, // Allows your JS to run in the web page
        },
    });

    win.loadFile('index.html');  // Loads the HTML page
    win.setResizable(false);

    // Remove menu bar
    win.removeMenu();

    // Open the DevTools for debugging
    win.webContents.openDevTools();

    // When the window is closed
    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
