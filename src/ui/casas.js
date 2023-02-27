import alerta from "../../utiles/alertasBootstrap.js";
import newPage from "./utiles/newPage.js";
import Notificacion from './../../utiles/Notificacion/Notificacion.js';

let casas = [];

export function init() {
    newPage('casas.html')
    .then(run)
    .catch(console.log);
}


function run() {
    const form = document.getElementById('form-casas');
    listarCasas();
    habilitarFormInputs(form);
    form.addEventListener('submit',habiltarFormulario);
}


async function listarCasas() {
    const {ident,data} = await window.modelCasa.allCasa();
    casas = data;
    console.log(ident, data);
}

async function habiltarFormulario(e) {
    e.preventDefault();
    const form = this;
    let idcod = null;
    if(localStorage.optionMenu != 3) {
       const lastHouse = casas.length !== 0 ? casas.at(-1).dataValues : {codigo: '0'};
       const codi = lastHouse.codigo;
       idcod = codi ? parseInt(codi) + 1 : 1; 
       idcod = String(idcod);
    }
    const [cod,dir,med,vactmed] = form.querySelectorAll('input');
    const [selecOwners,selectHouse] = form.querySelectorAll('select');
    if(selecOwners.value.trim() === 'none'){
        alerta('alert-warning','Por favor selecione un propietario.',2000);
        return
    }
    if(!selectHouse.parentElement.classList.contains('d-none') && selectHouse.value.trim() === 'none'){
        alerta('alert-warning','Por favor selecione un sector, es importante para la el codigo del domicilio',3000);
        return
    }
    if(dir.value.trim() === '') {
        alerta('alert-warning','Por favor ingrese una dirección del domicilio para continuar.',3000);
        return;
    }
    if(!med.parentElement.classList.contains('d-none') && med.value.trim() === ''){
        alerta('alert-warning','Por favor ingrese el número del medidor.',2000);
        return
    }

    if(!vactmed.parentElement.classList.contains('d-none') && vactmed.value.trim() === ''){
        alerta('alert-warning','Por favor ingrese el valor actual del medidor.',2000);
        return
    }
    let time = new Date();
    const int = Intl.DateTimeFormat('es',{
        year: 'numeric',
        month:'2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    }).format
    let [dateT,timeT] = int(time).split(' ');
    let [uno,dos,tres] =  dateT.split('/');
    tres = tres.replace(',','');
    const dates = tres + '-' + dos +'-' + uno + ' ' + timeT;
    const data = {
        codigo: localStorage.optionMenu == 3 ? cod.value.trim() : idcod,
        direccion: dir.value.trim(),
        medidor: med.value.trim(),
        valor_actual: vactmed.value.trim(),
        id_cliente: selecOwners.value.trim(),
        fecha: dates
    };
    console.log(data);
    const {ident,mensaje} = await window.modelCasa.addCasa(data);

    if(ident) {
        new Notificacion(`Se ingreso correctamente el domicilio, 
        el codigo que servira para futuras consultas y manipulación de datos es: <br>
        Codigo: <strong>${data.codigo}</stron> <br>
        Asegurese de brindarle al cliente dicho codigo y recomiendele que lo guarde
        muy bien.`,'Aceptar',false);
        listarCasas();
        selecOwners.value = selectHouse.value = 'none';
        cod.value = dir.value = med.value= vactmed.value = ''; 
    }else {
        alerta('alert-danger',mensaje,3000);
    }
} 

async function habilitarFormInputs(form) {
    if(localStorage.optionMenu != 3) {
        document.querySelectorAll('[menu-avanced]').forEach(d => d.classList.add('d-none'));
    }
    const [selecOwners,selectHouse] = form.querySelectorAll('select');
    const clientes = await window.modelCliente.allCliente();
    const sectores = await window.modelSector.allSector();
    
    let htmlOwners = '<option selected value="none" >Click para selecionar el propietario</option>';
                   
    let htmlSectores = '<option selected value="none" >Click para selecionar el sector</option>';

    clientes.data.forEach(d => {
        const {dataValues:data} = d;
        htmlOwners += `
        <option value="${data.cedula}"><stron>CI:<strong> ${data.cedula} ➡ ${data.nombres} ${data.apellidos}</option>
        `;
    });
    selecOwners.innerHTML = htmlOwners;
    sectores.data.forEach(d => {
        const {dataValues:data} = d;
        htmlSectores += `
        <option value="${data.codigo}">${data.detalle}</option>        
        `;
    })
    selectHouse.innerHTML = htmlSectores;

    selectHouse.addEventListener('change',asignacionCodigo);



}

function asignacionCodigo(e) {
    const value = this.value;
    const cod = document.getElementById('cod');
    if(value.trim() !== 'none'){
       const lastHouse = casas.length !== 0 ? casas.at(-1).dataValues : {codigo: 'DES-000'};
       const [sector, codi] = lastHouse.codigo.split('-');
       const idcod = codi ? parseInt(codi) + 1 : 1; 
       cod.value = value.trim() + '-' + idcod;
    }else {
        cod.value = '';
    }
}