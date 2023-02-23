const {ipcMain} = require('electron');
const Categorias = require('./../models/Categorias');


const categoria = new Categorias();

ipcMain.handle('op:category.add',async (e,data) => {
    console.log(data);
    return await categoria.insert(data);
})

ipcMain.handle('op:category.all', async () => {
    return await categoria.all();    
})