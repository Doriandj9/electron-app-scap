const {ipcMain} = require('electron');
const Categorias = require('./../models/Categorias');
const Sectores = require('./../models/Sectores');
const Clientes  = require('./../models/Clientes');
const Casas = require('./../models/Casas');
const CasasCategorias = require('./../models/CasasCategorias');
const Cobros = require('./../models/Cobros');
const generateReporte = require('./reportes');
const Compras = require('../models/Compras');


const categoria = new Categorias();
const sectores = new Sectores();
const clientes = new Clientes();
const casas = new Casas();
const casasCategorias = new CasasCategorias;
const cobros = new Cobros;
const compras = new Compras;

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
ipcMain.handle('op:cobro.casas', async (e,codigo) => {
    return await cobros.allCasasForOwner(codigo);    
})
ipcMain.handle('op:cobro.update.estado', async (e,data) => {
    return await casas.update(data);   
})
ipcMain.handle('op:cobro.verify.cobros', async (e,data) => {
    return await casas.updateAll(data);   
})
ipcMain.handle('op:cobro.mora', async () => {
    return await casas.cargarMora();
})

ipcMain.handle('op:consulta.all', async () => {
    return await cobros.all();
})
ipcMain.handle('op:consulta.query.op', async (e,data) => {
    return await cobros.queryOp(data);
})

ipcMain.handle('op:compra.all', async () => {
    return await compras.all();
})
ipcMain.handle('op:compra.insert', async (e,data) => {
    return await compras.manejoCaja(data);
})
ipcMain.handle('op:database.backup', async () => {
    return await cobros.all();
})

ipcMain.handle('op:reporte', (e,data) => {
    return  generateReporte(data);
})