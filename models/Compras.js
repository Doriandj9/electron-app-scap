const {sequelize} = require('./db/conection');
const {DataTypes,QueryTypes} = require('sequelize');
const Cobros = require('./Cobros');
class Compras {
    #model;
    #attibutes = ['id','nombre','precio','cantidad'];
    constructor() {
        this.#model = sequelize.define('compras',{
            id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true},
            nombre: DataTypes.STRING,
            precio: DataTypes.INTEGER,
            cantidad: DataTypes.STRING
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
                mensaje: error.errors[0].message
            }
        }
    }

    async manejoCaja(data){
        const {precio} = data;
        const cobros = new Cobros;
        const time = new Date();
        const format = Intl.NumberFormat('es',{
            minimumIntegerDigits: 2
        }).format
        const date = `${time.getFullYear()}-${format((time.getMonth() + 1))}-${format(time.getDate())}`

        let results = await sequelize.query(`
        SELECT id, ingreso FROM cobros WHERE ingreso >= ?;
            `,{
                replacements: [precio],
                type: QueryTypes.SELECT
            });

        if(results.length === 0){
            results = await sequelize.query(`
            SELECT id, ingreso FROM cobros WHERE ingreso < ?;
            `,{
                replacements: [precio],
                type: QueryTypes.SELECT
            });
            if(results.length === 0) {
                return {
                    ident:0,
                    mensaje: 'Error no contiene sufientes ingresos para realizar la transacción'
                }
            }
            let priceInt = precio;
            let updates = [];
            let ingreso = 0;
            results.forEach((res) => {
                let egreso = 0;
                let tempIng = priceInt;
                const {id,ingreso:dbPrice} = res;
                if(priceInt === 0){
                    return;
                }
                if(dbPrice >= tempIng){
                    egreso = dbPrice;
                }
                egreso = dbPrice <= tempIng ? dbPrice : tempIng;
                priceInt = parseFloat(priceInt) - parseFloat(dbPrice);
                if(priceInt < 0){
                    priceInt = priceInt * - 1;
                    ingreso = priceInt;
                    priceInt = 0;
                    egreso = tempIng;
                    
                }

                const dataSend = {id: id, data:{
                    ingreso: ingreso,
                    egreso: egreso,
                    fecha_compra: date
                }} 
                updates.push(dataSend);              
            })
            for(let com of updates){
                await cobros.update(com);
            }
            const respuesta = await this.insert(data);
            return respuesta;
        }

        const {id,ingreso:priceDB} = results[0];

        const res = parseFloat(priceDB) - parseFloat(precio);
        const dataSend = {id: id, data:{
            ingreso: res,
            egreso: precio,
            fecha_compra: date
        } } 

        const {ident,mensaje} = await cobros.update(dataSend)

        if(!ident){
            return  {
                ident:0,
                mensaje: 'Error no contiene no se pudo actualizar la caja para realizar la transacción'
            }
        }

        const respuesta = await this.insert(data);

        return respuesta;
    }
}

module.exports = Compras;