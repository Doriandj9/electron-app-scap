import Notificacion from "../../utiles/Notificacion/Notificacion.js";
import newPage from "./utiles/newPage.js";
import alerta from "../../utiles/alertasBootstrap.js";
import { CEDULA_REG_EXPRE } from "../../utiles/RegularExpresions/ConstExpres.js";

export function init() {
    newPage('cobros.html')
    .then(run)
    .catch(console.log);
}

function run () {
    if(localStorage.optionMenu == 3 && !localStorage.valorMetroCubico){
        new Notificacion(`Por favor ingrese el valor de metro cubico 
        en el menu principal para poder realizar los cobros.`,'Regresar');
        return;
    }

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
        codigo_sector,consumo,direccion,
        medidor,nombre_categoria,nombre_sector,
        precio,valor_actual,valor_anterior,mora,
        comision
    } = data;
    const consumoFinal = valor_actual - valor_anterior;
    const sobrepasa = consumoFinal > parseInt(consumo.replace('m3','')) ? true : false;
    const vaSo= ((valor_actual - valor_anterior) - (parseInt(consumo)));
    const subt =  (parseFloat(localStorage.valorMetroCubico) *  vaSo).toFixed(2);
    let total = sobrepasa ? (parseInt(precio) + parseFloat(subt)) : precio;
    const adidcional = `
    <div class="card" style="width: 25rem;">
            <div class="card-header">
                <h5 class="card-title">Consumo adicional</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Valor de metro cubico: </strong>${localStorage.valorMetroCubico + 'ctvs'}</li>
                <li class="list-group-item"><strong>Consumo exedido: </strong>${vaSo + 'm3'}</li>
            <li class="list-group-item"><strong>
            Sub Total : ${localStorage.valorMetroCubico}ctvs * ${vaSo}m3 = 
            <span class="text-primary">${subt}$
            </span></strong></li>
            <li class="list-group-item"><strong>Total a Pagar Final: ${precio}$ + ${subt}$ = <span class="text-primary">${total.toFixed(2)}$</span></strong></li>

            </ul>
        </div>
    `;
    let html = `
    <div class="card-header">
        <h5 class="card-title">Datos del cobro del domicilio encontrado.</h5>
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
                Categoria perteneciente
                </div>
                <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Nombre: </strong>${nombre_categoria}</li>
                <li class="list-group-item"><strong>Precio: </strong>${precio + '$'}</li>
                <li class="list-group-item"><strong>Maximo de Consumo: </strong>${consumo}</li>
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
    <div class="d-flex justify-content-center mt-3 gap-2">
        <div class="card" style="width: 25rem;">
            <div class="card-header">
                <h5 class="card-title">Información de la recaudación</h5>
            </div>
            <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Agua Consumida: </strong>${
                consumoFinal + 'm3'
            }</li>
            <li class="list-group-item"><strong>Consumo de Agua Sobrepasado: </strong>${
                sobrepasa ? 'SI' : 'NO'  
            }</li>
            <li class="list-group-item"><strong>Total a Pagar: <span class="text-primary">${precio}$</span></strong></li>

            </ul>
        </div>
        ${sobrepasa ? adidcional : ''}
    </div>
    <div class="d-flex justify-content-center mt-2">
        <button id="recaudacion"
         class="btn btn-primary ${comision ? 'd-none':''}">Realizar Recaudación
         </button>
         ${comision ? `<div class="ms-MessageBar ms-MessageBar--success">
         <div class="ms-MessageBar-content">
         <div class="ms-MessageBar-icon">
             <i class="ms-Icon ms-Icon--Completed"></i>
         </div>
         <div class="ms-MessageBar-text">
         Este cliente ya realizo el pago de agua potable que corresponde a este mes.
         </div>
         </div>
         </div>` : ''}
    </div>
    </div>
    `;    
    document.getElementById('container-info').innerHTML = html;
    const comisionTable = {
        ingreso: total,
        id_casa: codigo
    };
    activarReporte(codigo,comisionTable);
    colocarDatosIniciales({
        codigo,
        cedula,
        nombres,
        apellidos,
        total,
        consumoFinal
    });

}

function activarReporte(codigo,dataComision) {
    function interna(){
        actualizarValores(codigo,dataComision)
        .then(convertPDF)
        .catch(console.log)
    }
    const button = document.getElementById('recaudacion');
    button.addEventListener("click",interna);
    function convertPDF(){
    // let nombre = prompt('Ingrese un nombre para el archivo a descargar');
      const HTML = document.getElementById('reporte-final');
      HTML.classList.remove('hidden');
        html2pdf()
        .set({magin: 1,
              filename: 'Factura de Agua',
              image: {
                  type: 'jpeg',
                  quality: 0.98
              },
              html2canvas: {
                  scale: 3,
                  letterRendering: true,
              },
              jsPDF: {
                  unit: "in",
                  format: "a4",
                  orientation: 'portrait'
              },
              pagebreak: { mode: ['css', 'legacy']
            }
        })
        .from(HTML)
        .save()
        .catch(e => console.log(e))
        .finally(() => {
            HTML.classList.add('hidden');
        })
        .then(alert("Se ha descargado correctamente"));
    }
}

function colocarDatosIniciales({
        codigo,
        cedula,
        nombres,
        apellidos,
        total,
        consumoFinal
}) {
    const date = document.getElementById('date');
    const hour = document.getElementById('hour');
    const cedulaIn = document.getElementById('cedula');
    const names = document.getElementById('name');
    const lastnames = document.getElementById('lastname');
    const consumo = document.getElementById('consumo');
    const totalF = document.getElementById('total');
    const id = document.getElementById('id');
    const dateTime = new Date();
    const ilt = Intl.DateTimeFormat('es',{
        day:"2-digit",
        month: "long",
        year:"numeric"
    }).format;
    const itlh = Intl.DateTimeFormat('es',{
        hour:"numeric",
        minute:"2-digit"            
    }).format;
    date.textContent = ilt(dateTime);
    hour.textContent = itlh(dateTime);

    cedulaIn.innerHTML = cedula;
    names.innerHTML = nombres;
    lastnames.innerHTML = apellidos;

    consumo.innerHTML = consumoFinal + 'm3';
    totalF.innerHTML = total + '$';

    id.innerHTML = codigo;
}

async function actualizarValores(codigo,dataComision) {
    const  button = document.getElementById('recaudacion');
    console.log(codigo);
    const data = {
        codigo,
        data: {
            comision: 1
        }
    }
    // realizar el conbro hacia la tabla cobros
    const {ident,mensaje} = await window.modelCobro.addCobro(dataComision);
    if(ident) {
        const {ident, mensaje} = await window.modelCobro.updateEstado(data);
        if(ident) {
            const div = document.createElement('div');
            const html = `
                <div class="ms-MessageBar ms-MessageBar--success">
                <div class="ms-MessageBar-content">
                <div class="ms-MessageBar-icon">
                    <i class="ms-Icon ms-Icon--Completed"></i>
                </div>
                <div class="ms-MessageBar-text">
                Este cliente ya realizo el pago de agua potable que corresponde a este mes.
                </div>
                </div>
                </div>
            `;
            div.innerHTML = html;
            button.classList.add('d-none');
            button.parentElement.replaceChildren(div);
            
    
        }else {
            alerta('alert-danger','A ocurrido un error al momento de generar la recaudación,por favor intentelo más tarde.',4000);
        }
        
    }else{
        alerta('alert-danger','A ocurrido un error al momento de generar la recaudación,por favor intentelo más tarde.')
    }

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