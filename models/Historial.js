const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
class Historial {
    #model;
    #attibutes = ['id','id_casa','tipo','pago','fecha_pago','egreso','detalle_compra','fecha_compra','ingreso'];
    constructor() {
        this.#model = sequelize.define('historials',{
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
            id_casa: DataTypes.STRING,
            tipo: DataTypes.STRING,
            pago: DataTypes.DOUBLE,
            fecha_pago: DataTypes.DATE,
            egreso: DataTypes.DOUBLE,
            detalle_compra: DataTypes.STRING,
            fecha_compra: DataTypes.DATE,
            ingreso: DataTypes.DOUBLE
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
            console.log(error);
            return {
                ident:0,
                mensaje: error
            }
        }
    }
}

module.exports = Historial;