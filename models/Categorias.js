const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');

class Categorias {
    #categorias;

    constructor() {
        this.#categorias = sequelize.define('categorias',{
            id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement:true},
            nombre: DataTypes.STRING,
            precio: DataTypes.INTEGER,
            max_agua: DataTypes.STRING
        },{
            timestamps: false,
            createdAt: false,
            updatedAt: false
        });
    }

    async all() {
        try {
            const data = await this.#categorias.findAll({
                attributes: ['id','nombre','max_agua','precio']
            })

            return {
                ident: 1,
                data: data
            }
        } catch (error) {
            
            return {
                ident: 0,
                mensaje: error
            }
        }
    }

    async insert(data){
        try{
            await this.#categorias.create(data);
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

module.exports = Categorias;