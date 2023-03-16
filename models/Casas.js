const {sequelize} = require('./db/conection');
const {DataTypes,Op} = require('sequelize');
const Clientes = require('./Clientes');
class Casas {
    #model;
    #attibutes = ['id','codigo','direccion','medidor','id_sector',
    'valor_anterior','valor_actual','id_cliente','mora','comision','deuda'];
    constructor() {
        this.#model = sequelize.define('casas',{
            id: {type: DataTypes.INTEGER,primaryKey: true, autoIncrement: true},
            codigo: {type: DataTypes.STRING, primaryKey: true, autoIncrement:false,unique: true},
            direccion: DataTypes.STRING,
            medidor: DataTypes.STRING,
            valor_anterior: DataTypes.STRING,
            valor_actual: DataTypes.STRING,
            id_cliente: DataTypes.STRING,
            id_sector: DataTypes.STRING,
            mora: DataTypes.INTEGER,
            comision: DataTypes.BOOLEAN,
            deuda: DataTypes.INTEGER
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
            const [results, metadata] = await sequelize.query(`SELECT categorias.id as id_categoria,
            categorias.nombre as nombre_categoria, casas_categorias.id_casas as id_casas,
            casas_categorias.id_categorias as id_categoria,
            cedula, codigo, nombres, apellidos, medidor,direccion, casas.id as codigo_casa 
            FROM casas inner join clientes ON casas.id_cliente = clientes.cedula
            inner join casas_categorias ON  casas_categorias.id_casas = codigo 
            inner join categorias ON categorias.id = casas_categorias.id_categorias
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

    async update({codigo,data}) {
        try{
            const res = await this.#model.update(data,{
                where: {
                    codigo: codigo
                }
            });
            if(res[0] <= 0) throw Error('Error: A ocurrido un error al momento de generar la recaudación.');
            
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

    async updateAll(data){
        try{
            const res = await this.#model.update(data,{
                where:{
                    comision: 1
                }
            });
                
            return {
                ident:1,
                mensaje: 'Comprobacion exitosa'
            }
        }catch(error){
            console.log(error);
            return {
                ident:0,
                mensaje: error
            }
        }
    }

    async cargarMora() {
        try {
            const res = await this.#model.findAll({
                 attributes: ['mora','codigo'],
                 order:[
                     ['id','ASC']
                 ],
                 where:{
                    comision: 0
                },
                 
             });

             res.forEach(casa => {
                const {dataValues:dataV} = casa;
                const mora = parseInt(dataV.mora) + 1;
                const update = {
                    codigo: dataV.codigo,
                    data: {
                        mora: mora
                    }
                }
                this.update(update);
             });
             return {
                 ident:1,
                 data: res
             };
             
         } catch (error) {
            console.log(error);
             return {
                 ident: 0,
                 mensaje: error
             }
         }
    }
}

module.exports = Casas;