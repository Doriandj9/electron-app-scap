const {dialog,BrowserWindow, app} = require('electron');
const path =  require("path");
const Casas = require("../models/Casas");
const CasasCategorias = require("../models/CasasCategorias");
const Categorias = require("../models/Categorias");
const Clientes = require("../models/Clientes");
const Cobros = require("../models/Cobros");
const Compras = require("../models/Compras");
const Sectores = require("../models/Sectores");
const Usuarios = require("../models/Usuarios");
const fs = require('fs');
const Historial = require('../models/Historial');

async function backup() {
    const casas = new Casas;
    const casasCategorias = new CasasCategorias;
    const categorias = new Categorias;
    const clientes = new Clientes;
    const cobros = new Cobros;
    const compras = new Compras;
    const sectores = new Sectores;
    const usuarios = new Usuarios;
    const historial = new Historial;

    const {data:dataCasa} = await casas.all();
    const {data:dataCategorias} = await categorias.all();
    const {data:dataCasasCategorias} = await casasCategorias.all();
    const {data:dataClientes} = await clientes.all();
    const {data:dataCobros} = await cobros.all();
    const {data:dataCompras} = await compras.all();
    const {data:dataSectores} = await sectores.all();
    const {data:dataUsuarios} = await usuarios.all();
    const {data:dataHistorial} = await historial.all();
    fs.readFile(path.join(__dirname,'./../models/db/template.sql'),'utf-8',(err,data) => {
        if(err){
            throw err;
        }
        let dataReplace = data;
        let querysCasa = 'INSERT INTO `casas` VALUES (';
        if(dataCasa.length === 0) {
            querysCasa = '';
        }
        dataCasa.forEach(data => {
            const {dataValues} = data;
            querysCasa += dataValues.id + 
            ',' + `'${dataValues.codigo}'` + ',' + `'${dataValues.direccion}'` + ',' + `'${dataValues.medidor}'` +
            ',' + `'${dataValues.valor_anterior}'` + ',' + `'${dataValues.valor_actual}'` + ',' + `'${dataValues.id_cliente}'` +
            ',' + `'${dataValues.id_sector}'` + ',' + dataValues.mora + ',' + dataValues.comision + ',' +
            `'${dataValues.deuda}'` + '),(';
        });
        querysCasa = querysCasa.slice(0,-2);
        querysCasa += ';'
        let autoIncCasa = dataCasa.length + 1;
        dataReplace = dataReplace.replace('%inc-casas%',autoIncCasa);
        dataReplace = dataReplace.replace('%data-casas%',querysCasa);


        // datos de categorias

        let querysCategoria = 'INSERT INTO `categorias` VALUES (';
        if(dataCategorias.length === 0) {
            querysCategoria = '';
        }
        dataCategorias.forEach(data => {
            const {dataValues} = data;
            querysCategoria += dataValues.id + 
            ',' + `'${dataValues.nombre}'` + ',' + `'${dataValues.max_agua}'` + ',' + 
            dataValues.precio
            + '),(';
        });
        querysCategoria = querysCategoria.slice(0,-2);
        querysCategoria += ';'
        let autoIncCategoria = dataCategorias.length + 1;
        dataReplace = dataReplace.replace('%inc-categorias%',autoIncCategoria);
        dataReplace = dataReplace.replace('%data-categorias%',querysCategoria);

        // datos casasCategorias

        let querysCasasCategorias = 'INSERT INTO `casas_categorias` VALUES (';
        if(dataCasasCategorias.length === 0) {
            querysCasasCategorias = '';
        }
        dataCasasCategorias.forEach(data => {
            const {dataValues} = data;
            querysCasasCategorias += `'${dataValues.id_casas}',`+
            dataValues.id_categorias + '),(';
        });
        querysCasasCategorias = querysCasasCategorias.slice(0,-2);
        querysCasasCategorias += ';'
        dataReplace = dataReplace.replace('%data-casas-categorias%',querysCasasCategorias);

        // datos clientes

        let querysClientes = 'INSERT INTO `clientes` VALUES (';
        if(dataClientes.length === 0) {
            querysClientes = '';
        }
        dataClientes.forEach(data => {
            const {dataValues} = data;
            querysClientes += `'${dataValues.cedula}',`+
            `'${dataValues.nombres}',` + `'${dataValues.apellidos}',` +
            `'${dataValues.correo}',` + `'${dataValues.telefono}',` + `'${dataValues.codigo_sector}'`+
            '),(';
        });
        querysClientes = querysClientes.slice(0,-2);
        querysClientes += ';'
        dataReplace = dataReplace.replace('%data-clientes%',querysClientes);

        // datos cobros

        let querysCobros = 'INSERT INTO `cobros` VALUES (';
        if(dataCobros.length === 0) {
            querysCobros = '';
        }
        dataCobros.forEach(data => {
            const {dataValues} = data;
            querysCobros += dataValues.id +',' + dataValues.ingreso + ',' + `'${dataValues.fecha}',` +
            dataValues.acometida + ',' + `'${dataValues.detalle}',` + dataValues.egreso + `'${dataValues.fecha_compra}',` +
            `'${dataValues.id_casa}'` +
            '),(';
        });
        querysCobros = querysCobros.slice(0,-2);
        querysCobros += ';'
        let autoIncConbros = dataCobros.length + 1;
        dataReplace = dataReplace.replace('%inc-cobros%',autoIncConbros);
        dataReplace = dataReplace.replace('%data-cobros%',querysCobros);

        //datos compras
        
        let querysCompras = 'INSERT INTO `compras` VALUES (';
        if(dataCompras.length === 0) {
            querysCompras = '';
        }
        dataCompras.forEach(data => {
            const {dataValues} = data;
            querysCompras += dataValues.id + 
            ',' + `'${dataValues.nombre}'` + ',' + dataValues.precio + ',' + 
            `'${dataValues.cantidad}'`
            + '),(';
        });
        querysCompras = querysCompras.slice(0,-2);
        querysCompras += ';'
        let autoIncCompras = dataCompras.length + 1;
        dataReplace = dataReplace.replace('%inc-compras%',autoIncCompras);
        dataReplace = dataReplace.replace('%data-compras%',querysCompras);

        //datos historial

        let querysHistorial = 'INSERT INTO `historials` VALUES (';
        if(dataHistorial.length === 0) {
            querysHistorial = '';
        }
        dataHistorial.forEach(data => {
            const {dataValues} = data;
            querysHistorial += dataValues.id + 
            ',' + `'${dataValues.id_casa}'` + ',' + `'${dataValues.tipo}',` + dataValues.pago  + ',' +
            `'${dataValues.fecha_pago}',` + dataValues.egreso + ',' + `'${dataValues.detalle_compra}',` +
            `'${dataValues.fecha_compra}',` + dataValues.ingreso
            + '),(';
        });
        querysHistorial = querysHistorial.slice(0,-2);
        querysHistorial += ';'
        let autoHist = dataHistorial.length + 1;
        dataReplace = dataReplace.replace('%inc-historial%',autoHist);
        dataReplace = dataReplace.replace('%data-historial%',querysHistorial);



        //datos sectores
        
        let querysSectores = 'INSERT INTO `sectores` VALUES (';
        if(dataSectores.length === 0) {
            querysSectores = '';
        }
        dataSectores.forEach(data => {
            const {dataValues} = data;
            querysSectores += `'${dataValues.codigo}'` + ',' + `'${dataValues.detalle}'` + ',' + 
            dataValues.id_usuarios
            + '),(';
        });
        querysSectores = querysSectores.slice(0,-2);
        querysSectores += ';'
        dataReplace = dataReplace.replace('%data-sectores%',querysSectores);

        // datos de usuarios

        let querysUsuarios = 'INSERT INTO `usuarios` VALUES (';
        if(dataUsuarios.length === 0) {
            querysUsuarios = '';
        }
        dataUsuarios.forEach(data => {
            const {dataValues} = data;
            querysUsuarios += dataValues.id + 
            ',' + `'${dataValues.nombre}'` + ',' + `'${dataValues.clave}'`
            + '),(';
        });
        querysUsuarios = querysUsuarios.slice(0,-2);
        querysUsuarios += ';'
        let autoIncUsuarios = dataUsuarios.length + 1;
        dataReplace = dataReplace.replace('%inc-usuarios%',autoIncUsuarios);
        dataReplace = dataReplace.replace('%data-usuarios%',querysUsuarios);

        const file = dialog.showSaveDialog(BrowserWindow.getFocusedWindow(),{
            title: 'Guardar Respaldo',
            defaultPath: app.getPath('documents'),
            filters: [
                {
                    name: 'Archivos SQL',extensions:['sql']
                }
            ]
        });
       file
        .then(path => {
           if(path.canceled !== true) {
               fs.writeFile(path.filePath,dataReplace,(err) => {
                   if(err) {
                       throw err;
                   }
               })


           }else{
            throw new Error('No ha selecionado ningun apartado donde guardar el archivo.');
           }
       })
       .then(res => res)
       .catch(console.log)
      
    });
    
}

module.exports = {backup};