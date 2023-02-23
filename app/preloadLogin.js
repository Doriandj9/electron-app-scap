const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('dbConect',{
    conect(){return ipcRenderer.invoke('db:conect')},
    updateConect(data) {return ipcRenderer.invoke('db:update',data)},
    conectUpdateRes(){return ipcRenderer.invoke('db:update.res')},
    loginAut(data){return ipcRenderer.invoke('db:usuarios.aut',data)}
})