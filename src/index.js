import { app, BrowserWindow } from "electron";

const mysql = require("mysql2/promise");

if (require("electron-squirrel-startup")) app.quit();

let mainWindow;

const config = {
  host: "localhost",
  user: "root",
  database: "vk",
  password: "root",
};

global.connectMySQL = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 950,
    height: 600,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));

  global.connectMySQL = await mysql.createPool(config);
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
