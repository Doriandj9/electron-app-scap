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
    casas = data ?? [];
    let html = casas.length !== 0 ? '' : `<tr>
    <td colspan="6" class="text-center">
        <span class="h3 ">De momento no contiene ninigun domicilio disponbles.</span>
    </td>
  </tr>`;
    casas.forEach(dato => {
        html += `
        <tr>
            <td> ${dato.codigo}</td>
            <td> ${dato.direccion}</td>
            <td> ${dato.medidor}</td>
            <td> ${dato.nombre_categoria}</td>
            <td> ${dato.nombres.split(' ')[0] + ' ' + dato.apellidos.split(' ')[0]}</td>
            <td> ${dato.cedula}</td>
        </tr>
        `;
    });
    document.querySelector('tbody').innerHTML = html;
}

async function habiltarFormulario(e) {
    e.preventDefault();
    const form = this;
    let idcod = null;
    if(localStorage.optionMenu != 3) {
       const lastHouse = casas.length !== 0 ? casas.at(-1) : {codigo: '0'};
       const codi = lastHouse.codigo;
       idcod = codi ? parseInt(codi) + 1 : 1; 
       idcod = String(idcod);
    }
    const [cod,dir,med,vactmed] = form.querySelectorAll('input');
    const [selecOwners,selectHouse,selectCategorias] = form.querySelectorAll('select');
    if(selecOwners.value.trim() === 'none'){
        alerta('alert-warning','Por favor selecione un propietario.',2000);
        return
    }
    if(!selectHouse.parentElement.classList.contains('d-none') && selectHouse.value.trim() === 'none'){
        alerta('alert-warning','Por favor selecione un sector, es importante para la el codigo del domicilio',3000);
        return
    }
    if(selectCategorias.value.trim() === 'none'){
        alerta('alert-warning','Por favor selecione una categoria de cobro para el domicilio',3000);
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
    const data = {
        codigo: localStorage.optionMenu == 3 ? cod.value.trim() : idcod,
        direccion: dir.value.trim(),
        medidor: med.value.trim(),
        valor_actual: vactmed.value.trim(),
        id_cliente: selecOwners.value.trim(),
        id_sector: selectHouse.value.trim()
    };
    const dataCasasCategory = {
        id_categorias: selectCategorias.value.trim(),
        id_casas: data.codigo
    };

    const {ident,mensaje} = await window.modelCasa.addCasa(data);
    if(ident) {
        const {identCa,mensajeCa} = await window.modelCasa.addCasaAndCategory(dataCasasCategory);
        new Notificacion(`Se ingreso correctamente el domicilio, 
        el codigo que servira para futuras consultas y manipulación de datos 
        es el siguiente. <br><hr> 
        Codigo: <strong>${data.codigo}</strong> <hr> <br>
        Asegurese de brindarle al cliente dicho codigo y recomiendele que lo guarde
        en un lugar seguro.`,'Aceptar',false);
        selecOwners.value = selectHouse.value = 'none';
        cod.value = dir.value = med.value= vactmed.value = ''; 
        listarCasas();
    }else {
        alerta('alert-danger',mensaje,3000);
    }
} 

async function habilitarFormInputs(form) {
    if(localStorage.optionMenu != 3) {
        document.querySelectorAll('[menu-avanced]').forEach(d => d.classList.add('d-none'));
    }
    const [selecOwners,selectHouse,selectCategorias] = form.querySelectorAll('select');
    const clientes = await window.modelCliente.allCliente();
    const sectores = await window.modelSector.allSector();
    const categorias = await window.menuValues.allCategory();

    let htmlOwners = '<option selected value="none" >Click para selecionar el propietario</option>';
                   
    let htmlSectores = '<option selected value="none" >Click para selecionar el sector</option>';

    let htmlCategories = '<option selected value="none" >Click para selecionar la categoria</option>';

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

    categorias.data.forEach(d => {
        const {dataValues:data} = d;
        htmlCategories += `
        <option value="${data.id}">${data.nombre}</option>        
        `;
    })
    selectCategorias.innerHTML = htmlCategories;

    selectHouse.addEventListener('change',asignacionCodigo);



}

function asignacionCodigo(e) {
    const value = this.value;
    const cod = document.getElementById('cod');
    if(value.trim() !== 'none'){
       const lastHouse = casas.length !== 0 ? casas.at(-1) : {codigo: 'DES-000'};
       const [sector, codi] = lastHouse.codigo.split('-');
       const idcod = codi ? parseInt(codi) + 1 : 1; 
       cod.value = value.trim() + '-' + idcod;
    }else {
        cod.value = '';
    }
}