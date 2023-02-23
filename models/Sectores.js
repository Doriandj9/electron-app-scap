const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class Sectores {
    #model;
    #attibutes = ['codigo','detalle','id_usuarios'];
    constructor() {
        this.#model = sequelize.define('sectores',{
            codigo: {type: DataTypes.STRING, primaryKey: true, autoIncrement:false},
            detalle: DataTypes.STRING,
            id_usuarios: DataTypes.INTEGER
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

module.exports = Sectores;