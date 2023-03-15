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

contextBridge.exposeInMainWorld('modelCasa',{
    addCasa(data){return ipcRenderer.invoke('op:casa.add',data)},
    addCasaAndCategory(data){return ipcRenderer.invoke('op:casa.category.add',data)},
    allCasa(){return ipcRenderer.invoke('op:casa.all')}
})

contextBridge.exposeInMainWorld('modelCobro',{
    addCobro(data){return ipcRenderer.invoke('op:cobro.add',data)},
    infoCobro(codigo){return ipcRenderer.invoke('op:cobro.info',codigo)},
    updateEstado(data) {return ipcRenderer.invoke('op:cobro.update.estado',data)},
    allCasas(codigo){return ipcRenderer.invoke('op:cobro.casas',codigo)},
    verifyCobros(data) {return ipcRenderer.invoke('op:cobro.verify.cobros',data)},
    loadMora() {return ipcRenderer.invoke('op:cobro.mora')}
})

contextBridge.exposeInMainWorld('modelConsulta',{
    all(){return ipcRenderer.invoke('op:consulta.all')},
    queryOp(data){return ipcRenderer.invoke('op:consulta.query.op',data)}
})

contextBridge.exposeInMainWorld('reporte',{
    reporte(data){return ipcRenderer.invoke('op:reporte',data)}
})