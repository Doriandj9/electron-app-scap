const {Sequelize} = require('sequelize');
const {ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');
let sequelize = null;

fs.readFile(path.join(__dirname,'confg.json'),'utf8',(err,data) => {
    if(err){
        throw err;
    }

    const {config} = JSON.parse(data);
    sequelize = new Sequelize(config.dbname,config.user,config.clave,config.server);
    conect();
})





async  function conect() {
    try{
        await sequelize.authenticate()
        ipcMain.handleOnce('db:conect',() => {
            module.exports = {
                sequelize
            }
            require('./../../controllers/login');
            return {
            ident: 1,
            mensaje: 'Coneccion Correcta'
            }
            
        });
    }catch(e){
            ipcMain.handle('db:conect',() => {
                return {
                ident: 0,
                mensaje: e
            }
        });
    }
}

async  function conectUpdate(data) {
    try{
        await sequelize.authenticate()
        // codigo para guardar en un archivo json 
        saveFile(data);
        
        ipcMain.handleOnce('db:update.res',() => {
            module.exports = {
                sequelize
            }
            require('./../../controllers/login');
            return {
            ident: 1,
            mensaje: 'Coneccion Correcta'
            }
        });
        require('./../../controllers/login');
    }catch(e){
            ipcMain.handleOnce('db:update.res',() => {
                return {
                ident: 0,
                mensaje: e
            }
        });
    }
}
ipcMain.handle('db:update',(e, datos) => {
    sequelize =  new Sequelize(datos.dbname,datos.user,datos.clave,datos.server);
    return conectUpdate(datos);
  })

function saveFile(data){
    const dataDB = {config: data};
    fs.writeFile(path.join(__dirname,'confg.json'),JSON.stringify(dataDB),(err) => {
        if(err){
            throw err
        }

        console.log('Se guardo correctamente los datos');
    })
}




