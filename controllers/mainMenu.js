const {ipcMain} = require('electron');
const Categorias = require('./../models/Categorias');
const Sectores = require('./../models/Sectores');
const Clientes  = require('./../models/Clientes');
const Casas = require('./../models/Casas');
const CasasCategorias = require('./../models/CasasCategorias');
const Cobros = require('./../models/Cobros');


const categoria = new Categorias();
const sectores = new Sectores();
const clientes = new Clientes();
const casas = new Casas();
const casasCategorias = new CasasCategorias;
const cobros = new Cobros;


ipcMain.handle('op:category.add',async (e,data) => {
    return await categoria.insert(data);
})

ipcMain.handle('op:category.all', async () => {
    return await categoria.all();    
})



ipcMain.handle('op:sector.add', async (e,data) => {
    return await sectores.insert(data) 
})

ipcMain.handle('op:sector.all', async () => {
    return await sectores.all();    
})



ipcMain.handle('op:cliente.add', async (e,data) => {
    return await clientes.insert(data);    
})

ipcMain.handle('op:cliente.all', async () => {
    return await clientes.all();    
})


ipcMain.handle('op:casa.add', async (e,data) => {
    return await casas.insert(data);    
})

ipcMain.handle('op:casa.all', async () => {
    return await casas.allWihtOwner();
})

ipcMain.handle('op:casa.category.add', async (e,data) => {
    return await casasCategorias.insert(data);    
})


ipcMain.handle('op:cobro.add', async (e,data) => {
    return await cobros.insert(data);    
})
ipcMain.handle('op:cobro.info', async (e,codigo) => {
    return await cobros.info(codigo);    
})