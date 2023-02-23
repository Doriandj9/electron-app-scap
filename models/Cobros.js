const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class Cobros {
    #model;
    #attibutes = ['id','ingreso','fecha','id_casa'];
    constructor() {
        this.#model = sequelize.define('cobros',{
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
            ingreso: DataTypes.INTEGER,
            fecha: DataTypes.DATE,
            id_casa: DataTypes.STRING
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

module.exports = Cobros;