const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('menuValues',{
    addCategory(data){return ipcRenderer.invoke('op:category.add',data)},
    allCategory(){return ipcRenderer.invoke('op:category.all')}
})

contextBridge.exposeInMainWorld('modelSector',{
    addSector(data){return ipcRenderer.invoke('op:sector.add',data)},
    allSector(){return ipcRenderer.invoke('op:sector.all')}
})


contextBridge.exposeInMainWorld('modelCliente',{
    addCliente(data){return ipcRenderer.invoke('op:cliente.add',data)},
    allCliente(){return ipcRenderer.invoke('op:cliente.all')}
})
