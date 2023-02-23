const {ipcMain,BrowserWindow} = require('electron');
const Usuarios = require('./../models/Usuarios');
const path = require('path');
const {mainWindow} = require('./../app/main');
let menuWindow = null;
const user = new Usuarios;
ipcMain.handle('db:usuarios.aut',async (e,data) => {
    if(await user.aut(data)){
        mainWindow.hide();
        createWindow();
        mainWindow.close();
    }
    return {mensaje: 'Usuario o contraseña incorrectos.'};
})


const createWindow = () => {
    menuWindow = new BrowserWindow({
        width:1200,
        height:650,
        webPreferences:{
            preload: path.join(__dirname,'./../app/preloadPrincipal.js'),
            sandbox: false,
            nodeIntegration: true
        },
        show: false
    });

    menuWindow.on('ready-to-show',() => {
        menuWindow.show();
    })

    menuWindow.maximize();

    menuWindow.loadFile(path.join(__dirname,'./../views/principal.html'));

    require('./mainMenu');
}

