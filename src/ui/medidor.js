import Notificacion from "../../utiles/Notificacion/Notificacion.js";
import newPage from "./utiles/newPage.js";
import alerta from "../../utiles/alertasBootstrap.js";
import { CEDULA_REG_EXPRE } from "../../utiles/RegularExpresions/ConstExpres.js";

export function init() {
    newPage('medidor.html')
    .then(run)
    .catch(console.log);
}


function run() {
    let SearchBoxElements = document.querySelectorAll(".ms-SearchBox");
    for (let i = 0; i < SearchBoxElements.length; i++) {
        new fabric['SearchBox'](SearchBoxElements[i]);
    }

    const busqueda = document.getElementById('busqueda-cobros');
    const textInput = document.getElementById('busqueda-text');

    busqueda.addEventListener('click',busquedaDatos);
    textInput.addEventListener('search',busquedaDatos);
}

async function busquedaDatos(e) {
    e.preventDefault();
    const busqueda = document.getElementById('busqueda-text');
    const regCod = /-/;
    if(CEDULA_REG_EXPRE.test(busqueda.value.trim())){
        // buscamos por cedula
        const casas = await window.modelCobro.allCasas(busqueda.value.trim());
        listarCasas(casas.data);
        return;
    }

    if(regCod.test(busqueda.value.trim())){
        presentacionDatos(busqueda.value.trim());
        return;
    }

    alerta('alert-warning', 'El valor ingresado no corresponde a un número de cédula o código de casa',3000);
}

async function presentacionDatos(codigoCasa){
    const {ident,data} = await window.modelCobro.infoCobro(codigoCasa);
    if(!ident){
        alerta('alert-danger', 'A ocurrido un erro al realizar la busqueda, por favor intentelo mas tarde');
        return;
    }

    if(!data){
        new Notificacion('No existe la casa con el codigo <stron>' + codigoCasa + '</strong>','Regresar');
        return;
    }
    const {
        apellidos,nombres,cedula,codigo,
        codigo_sector,direccion,valor_anterior,
        valor_actual,medidor,nombre_sector
    } = data;
    

  
    let html = `
    <div class="card-header">
        <h5 class="card-title">Datos del domicilio encontrado.</h5>
    </div>
    <div class="card-body" id="con">
        <div class="d-flex flex-wrap gap-3 justify-content-around">
            <div class="card" style="width: 18rem;">
                <div class="card-header">
                Datos del propietario
                </div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Nº Cédula: </strong>${cedula}</li>
                <li class="list-group-item"><strong>Nombres: </strong>${nombres}</li>
                <li class="list-group-item"><strong>Apellidos: </strong>${apellidos}</li>
                </ul>
            </div>

            <div class="card" style="width: 18rem;">
                <div class="card-header">
                Datos del domicilio
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Código: </strong>${codigo}</li>
                <li class="list-group-item"><strong>Dirección: </strong>${direccion}</li>
                <li class="list-group-item"><strong>Nº Medidor: </strong>${medidor}</li>
                </ul>
            </div>

            <div class="card" style="width: 18rem;">
                <div class="card-header">
                Sector del domicilio
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Codigo: </strong>${codigo_sector}</li>
                <li class="list-group-item"><strong>Nombre: </strong>${nombre_sector}</li>
                </ul>
            </div>

    </div>
    <div class="d-flex justify-content-center mt-3">
                <form data-id="${codigo}" class="w-75 border p-3 border-1 border-dark-subtle" id="form-category">
                <div class="mb-3">
                <h5 class="mt-2 text-center  h5 border border-1 border-dark border-opacity-25 pb-2
                border-top-0 border-end-0 border-start-0 ps-4">Actualize el valor del medidor</h5>
                </div>
                    <div class="mb-3">
                        <label class="ms-Label is-required">Valor actual del medidor</label>
                        <input id="" type="text" value="${valor_actual}m3" class="ms-TextField-field fw-bold" disabled>
                        <div id="emailHelp" class="form-text">Este valor es el ultimo valor ingresado lo cual se considera como el valor anterior.</div>
                    </div>
                    <div class="mb-3">
                        <label class="ms-Label is-required">Ingrese el nuevo valor del medidor</label>
                        <input id="price" type="text" class="ms-TextField-field fw-bold" placeholder="Por ejemplo: 120m3">
                    </div>
                    <button class="ms-Button ms-Button--primary">
                        <span class="ms-Button-label">Actualizar Datos</span> 
                    </button>
                </form>
            </div>
    </div>
    `;    
   const cont = document.getElementById('container-info');
    cont.innerHTML = html;
    const form = cont.querySelector('form');
    const price = form.querySelector('input#price');
    const expres = /(^[0-9]+)$/;
    price.addEventListener('input', () => {
        if(!expres.test(price.value.trim())){
            let valor = price.value.trim().split('');
            valor.pop();
            price.value = valor.join('');
        }
    })
    price.addEventListener('change',() => {
        if(price.value.trim() === 'm3' ||price.value.trim() === '' ){
            price.value = '';
            return;
        }
        price.value = price.value + 'm3';
    });

    form.addEventListener('submit',enviarDatos);
}

function listarCasas(casas) {
    if(!casas || casas.length <= 0){
        new Notificacion('El cliente no contiene domicilios suscritos a su nombre.','Regresar');
        return;
    }
    let html ='';
    casas.forEach(casa => {
         html += `
        <div data-codigo="${casa.codigo}" class="card selected-casa" style="width: 18rem;">
                <div class="card-header">
                Datos del domicilio
                </div>
                    <ul class="list-group list-group-flush">
                    <li class="list-group-item"><strong>Código: </strong>${casa.codigo}</li>
                    <li class="list-group-item"><strong>Dirección: </strong>${casa.direccion}</li>
                    </ul>
                </div>
                `; 
    });
    let htmlHeader = `
    <div class="card-header">
        <h5 class="card-title">Seleccione uno de los siguientes domicilios que pertenecen a ${casas[0].nombres} ${casas[0].apellidos}</h5>
    </div>
    <div class="card-body" id="con">
    <div class="d-flex flex-wrap gap-3 justify-content-around">
        ${html}
    </div>
    </div>
    `;
    document.getElementById('container-info').innerHTML = htmlHeader;

    document.querySelectorAll('div.card.selected-casa')
    .forEach(div => {
        div.addEventListener('click',() => {
            const codigoCasa = div.dataset.codigo;
            presentacionDatos(codigoCasa);
        })
    })
}

async function enviarDatos(e) {
    e.preventDefault();
    const form = e.target;
    const valA = form.querySelector('input');
    const price = form.querySelector('input#price');
    const codigo = form.dataset.id;

    if(price.value.trim() === '' ){
        alerta('alert-warning','Hay entradas vacias por favor ingrese valores para continuar.',3500);
        return;
    } 

    const data = {
        codigo: codigo,
        data:{
            valor_actual: parseInt(price.value.trim()),
            valor_anterior: parseInt(valA.value.trim())
        }
    }

    const {ident,mensaje} = await window.modelCobro.updateEstado(data);

    if(ident){
        alerta('alert-success','Se actualizo correctamente el valor',3000);
        document.getElementById('container-info').innerHTML ='';
    }else{
        alerta('alert-danger','Ocurrio un error al intentar agregar la acometida intentelo mas tarde.',4000);
    }

}
