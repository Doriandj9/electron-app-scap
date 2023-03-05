const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
const Clientes = require('./Clientes');
class Casas {
    #model;
    #attibutes = ['codigo','direccion','medidor','valor_anterior','valor_actual','id_cliente'];
    constructor() {
        this.#model = sequelize.define('casas',{
            codigo: {type: DataTypes.STRING, primaryKey: true, autoIncrement:false},
            direccion: DataTypes.STRING,
            medidor: DataTypes.STRING,
            valor_anterior: DataTypes.STRING,
            valor_actual: DataTypes.STRING,
            id_cliente: DataTypes.STRING
        },{
            timestamps: false,
            createdAt: false,
            updatedAt: false
        }
        );
    }

    async all(){
        try {
           const res = await this.#model.findAll({
                attributes: this.#attibutes,
                order:[
                    ['id','ASC']
                ]
            });
            return {
                ident:1,
                data: res
            };
            
        } catch (error) {
            return {
                ident: 0,
                mensaje: error
            }
        }
    }

    async insert(data){
        try{
            await this.#model.create(data);
            return {
                ident:1,
                mensaje: 'Se ingreso correctamente.'
            }
        }catch(error){
            console.log(error);
            return {
                ident:0,
                mensaje: error
            }
        }
    }

    async allWihtOwner() {
        try {
            const [results, metadata] = await sequelize.query(`SELECT 
            cedula, codigo, nombres, apellidos, medidor,direccion,id 
            FROM casas inner join clientes ON casas.id_cliente = clientes.cedula
            ORDER BY casas.id`);
        // Results will be an empty array and metadata will contain the number of affected rows.
             return {
                 ident:1,
                 data: results
             };
             
         } catch (error) {
             return {
                 ident: 0,
                 mensaje: error
             }
         }
    }
}

module.exports = Casas;