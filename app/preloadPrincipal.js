const {contextBridge,ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('menuValues',{
    addCategory(data){return ipcRenderer.invoke('op:category.add',data)},
    allCategory(){return ipcRenderer.invoke('op:category.all')}
})

