const {sequelize} = require('./db/conection');
const {DataTypes, QueryTypes, Sequelize} = require('sequelize');
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
    /**
     * 
     * @param {*} codigo 
     * @returns {Promise<{ident:number,data:Array<Sequelize>}>}
     */
    async info(codigo) {
        try {
            const [results, metadata] = await sequelize.query(`SELECT clientes.cedula as cedula,
            clientes.nombres as nombres, clientes.apellidos as apellidos, 
            casas.codigo as codigo, casas.direccion as direccion, casas.medidor,
            casas.valor_anterior as valor_anterior, casas.valor_actual as valor_actual,
            categorias.nombre as nombre_categoria, categorias.precio as precio,
            categorias.max_agua as consumo,
            sectores.codigo as codigo_sector, sectores.detalle as nombre_sector
            FROM clientes inner join casas ON casas.id_cliente = clientes.cedula
            inner join casas_categorias ON  casas_categorias.id_casas = casas.codigo
            inner join categorias ON casas_categorias.id_categorias = categorias.id
            inner join sectores ON sectores.codigo = casas.id_sector
            where casas.codigo = ?
            `,{
                replacements: [codigo],
                type: QueryTypes.SELECT
            });
            return {
                ident:1,
                data: results
            };
        } catch (error) {
            console.log(error);
            return {
                ident:0,
                mensaje: error
            };
        }
    }
}

module.exports = Cobros;