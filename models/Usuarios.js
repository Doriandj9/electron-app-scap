const {sequelize} = require('./db/conection');
const {DataTypes} = require('sequelize');
const {encrypt,verifyHash} = require('./../utiles/encrypter');
class Usuarios {
    #model;
    constructor() {
        this.#model = sequelize.define('usuarios',{
            id: {type: DataTypes.SMALLINT, primaryKey: true, autoIncrement:true},
            nombre: DataTypes.STRING,
            clave: DataTypes.STRING
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
                attributes: ['id','nombre','clave']
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
        data.clave = await encrypt(data.clave);
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

    async findOne(nameUser){
        try {
            const user = await this.#model.findOne({
                attributes: ['id','nombre','clave'],
                where: {
                    nombre: nameUser
                }
            })
            return {
                ident:1,
                data: user
            };
        } catch (error) {
            return {
                ident:0,
                mensaje: error
            }
        }
    }

    async aut(data) {
        const user = await this.findOne(data.user);
        
        if(user.data && await verifyHash(data.pass,user.data.dataValues.clave)){
            return true;
        }else{
            return false;
        }
    }
}



module.exports = Usuarios;