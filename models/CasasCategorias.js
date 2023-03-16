const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class CasasCategorias {
    #model;
    #attibutes = ['id_casas','id_categorias'];
    constructor() {
        this.#model = sequelize.define('casas_categorias',{
            id_casas: {type: DataTypes.STRING, primaryKey: true, autoIncrement:false},
            id_categorias: {type: DataTypes.INTEGER,primaryKey: true,unique: true}
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

module.exports = CasasCategorias;