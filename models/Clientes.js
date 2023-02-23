const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class Clientes {
    #model;
    #attibutes = ['cedula','nombres','apellidos','correo','telefono','codigo_sector'];
    constructor() {
        this.#model = sequelize.define('clientes',{
            cedula: {type: DataTypes.STRING, primaryKey: true, autoIncrement:false},
            nombres: DataTypes.STRING,
            apellidos: DataTypes.STRING,
            correo: DataTypes.STRING,
            telefono: DataTypes.STRING,
            codigo_sector: DataTypes.STRING
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
                attributes: this.#attibutes
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
            return {
                ident:0,
                mensaje: error
            }
        }
    }
}

module.exports = Clientes;