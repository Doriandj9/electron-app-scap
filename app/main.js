const {app, BrowserWindow,Menu} = require('electron');
const templateMenu = require('./menu-aplication');
const path = require('path');
// la variable que contendra la pantalla prinicpal de forma global
let mainWindow = null;
if (require('electron-squirrel-startup')) app.quit();
// Creamos la ventana principal
const createMainWindow = () => {
    Menu.setApplicationMenu(templateMenu);
    mainWindow = new BrowserWindow({
        width: 900,
        height: 750,
        webPreferences:{
            preload: path.join(__dirname,'preloadLogin.js'),
            sandbox: false,
            nodeIntegration: true
        },
        show: false
    });
    mainWindow.loadFile(path.join(__dirname,'index.html'));
    // cerramos la aplicacion si todas las ventanas se cierran
    app.on('window-all-closed' , () => {
        app.quit();
    });

    mainWindow.once('ready-to-show',() => {
        mainWindow.show();
    })
    //exportaciones

    module.exports = {
        mainWindow
    }
    
}


// inicializamos la aplicacion 
app.whenReady().then(() => {
    createMainWindow();
    require('./../models/db/conection');
    
})

