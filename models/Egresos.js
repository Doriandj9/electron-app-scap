const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class Egresos {
    #model;
    #attibutes = ['id','detalle','fecha','valor','id_usuarios'];
    constructor() {
        this.#model = sequelize.define('egresos',{
            id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement:true},
            detalle: DataTypes.STRING,
            fecha: DataTypes.DATE,
            valor: DataTypes.INTEGER,
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

module.exports = Egresos;