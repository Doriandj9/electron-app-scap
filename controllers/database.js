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

async function backup() {
    const casas = new Casas;
    const casasCategorias = new CasasCategorias;
    const categorias = new Categorias;
    const clientes = new Clientes;
    const cobros = new Cobros;
    const compras = new Compras;
    const sectores = new Sectores;
    const usuarios = new Usuarios;

    const dataCasa = await casas.all();
    const dataCategorias = await categorias.all();
    const dataCasasCategorias = await casasCategorias.all();
    const dataClientes = await clientes.all();
    const dataCobros = await cobros.all();
    const dataCompras = await compras.all();
    const dataSectores = await sectores.all();
    const dataUsuarios = await usuarios.all();

    fs.readFile(path.join(__dirname,'./../models/db/template.sql'),'utf-8',(err,data) => {
        if(err){
            throw err;
        }
        let dataReplace = data;
        let querysCasa = 'INSERT INTO `casas` VALUES ('
        dataCasa.forEach(data => {
            const {dataValues} = data;
            querysCasa += dataValues.id + 
            ',' + dataValues.codigo + ',' + dataValues.direccion + ',' + dataValues.medidor +
            ',' + dataValues.valor_anterior + ',' + dataValues.valor_actual + ',' + dataValues.id_cliente +
            ',' + dataValues.id_sector + ',' + dataValues.mora + ',' + dataValues.comision + ',' +
            dataValues.deuda + ');';
        });

        dataReplace = dataReplace.replace('%data-casas%',querysCasa);


        fs.writeFile(path.join(__dirname,'./../backup.sql'),dataReplace,(err) => {
            if(err) {
                throw err;
            }
        })
    })


}

module.exports = {backup};