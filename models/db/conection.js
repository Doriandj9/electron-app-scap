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
    conect()
    .then()
    .catch(console.log);
})





async  function conect() {

        ipcMain.handleOnce('db:conect',async () => {
            try {
                await sequelize.authenticate()
                module.exports = {
                    sequelize
                }
                require('./../../controllers/login');
                return {
                ident: 1,
                mensaje: 'Coneccion Correcta'
                }
            } catch (error) {
                return {
                    ident: 0,
                    mensaje: error
                }
            }
            
        });
}

async  function conectUpdate(data) {
    try{
        // codigo para guardar en un archivo json 
        
        ipcMain.handleOnce('db:update.res',async () => {
            try {
                await sequelize.authenticate()
                module.exports = {
                    sequelize
                }
                saveFile(data);
                require('./../../controllers/login');
                return {
                ident: 1,
                mensaje: 'Coneccion Correcta'
                }
            } catch (error) {
                return {
                    ident: 0,
                    mensaje: error
                }
            }
        });
    }catch(e){
        console.log(e);
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




