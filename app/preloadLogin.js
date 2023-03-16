const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('dbConect',{
    conect(){return ipcRenderer.invoke('db:conect')},
    updateConect(data) {return ipcRenderer.invoke('db:update',data)},
    conectUpdateRes(){return ipcRenderer.invoke('db:update.res')},
    conectUpdateResError(){return ipcRenderer.invoke('db:update.res.error')},
    loginAut(data){return ipcRenderer.invoke('db:usuarios.aut',data)}
})

contextBridge.exposeInMainWorld('usuario',{
    insert(data){return ipcRenderer.invoke('op:usuario.insert',data)}
})