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
        comision,deuda
    } = data;
    const consumoFinal = valor_actual - valor_anterior;
    const sobrepasa = consumoFinal > parseInt(consumo.replace('m3','')) ? true : false;
    const vaSo= ((valor_actual - valor_anterior) - (parseInt(consumo)));
    const subt =  (parseFloat(localStorage.valorMetroCubico) *  vaSo).toFixed(2);
    const moraValue = (parseFloat(localStorage.valorMora) * parseInt(mora)).toFixed(2);
    let total = sobrepasa ? (parseInt(precio) + parseFloat(subt)) : precio;
    
    const adidcional = `
    <div class="card" style="width: 25rem;">
            <div class="card-header">
                <h5 class="card-title">Consumo adicional.</h5>
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
    let totalBefore = total;
    if(parseInt(mora) > 0){
        total += parseFloat(moraValue);
    }
    const moraHtml = `
    <div class="card" style="width: 25rem;">
            <div class="card-header">
                <h5 class="card-title">Mora por atraso de pago.</h5>
            </div>
            <ul class="list-group list-group-flush">
            <li class="list-group-item"><strong>Valore de la mora: </strong>${localStorage.valorMora + '$'}</li>
                <li class="list-group-item"><strong>Meses sin pagar: 
                </strong>${mora}</li>
            <li class="list-group-item"><strong>
            Sub Total : ${localStorage.valorMora}$ * ${mora} meses = 
            <span class="text-primary">${moraValue}$
            </span></strong></li>
            <li class="list-group-item"><strong>Total a Pagar Final: ${totalBefore}$ + ${moraValue}$ = <span class="text-primary">${total}$</span></strong></li>
            </ul>
    </div>
    `;
    let valueDeuda = 0;
    if(deuda > 0){
        valueDeuda = total;
        total = ((comision ? parseFloat(0) : parseFloat(total)) + parseFloat(deuda)).toFixed(2);

    }
    const deudaHtml = `
    <div class="card" style="width: 25rem;">
        <div class="card-header">
            <h5 class="card-title">Deuda por pago por partes.</h5>
        </div>
        <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Deuda anterior: </strong>${parseFloat(deuda).toFixed(2) + '$'}</li>
        <li class="list-group-item"><strong>
        Total a pagar con deuda : ${comision ? 0 : valueDeuda}$ + ${parseFloat(deuda).toFixed(2)}$ = 
        <span class="text-primary">${total}$
        </span></strong></li>
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
            <li class="list-group-item"><strong>Total a Pagar: <span class="text-primary">${comision && deuda > 0 ? parseFloat(deuda).toFixed(2) : precio}$</span></strong></li>

            </ul>
        </div>
        ${sobrepasa ? adidcional : ''}
        ${parseInt(mora) > 0 ? moraHtml : ''}
        ${deuda > 0 ? deudaHtml : ''}
    </div>
    <div class="d-flex gap-2 justify-content-center mt-2">
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
         ${(!comision) || deuda && deuda > 0 ? `
         <button id="deuda"
         class="btn btn-primary">Recaudación por partes
         </button>
         `:''}
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
        consumoFinal,
    });

    cobrosPorPartes({codigo,total,nombres,apellidos,consumoFinal,cedula})

}

function activarReporte(codigo,dataComision,deudaoption=false) {
    function interna(e){
        e.stopPropagation();
        if(confirm('Esta seguro de realizar el pago completo.')){
            actualizarValores(codigo,dataComision)
            .then(convertPDF)
            .catch(console.log)
        }
        return;
    }
    const button = document.getElementById('recaudacion');
   if(deudaoption){
    convertPDF();
   }
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
            if(deudaoption){
                presentacionDatos(codigo);
            }
        })
        .then(alert('A continuación se procedera a descargar la factura de cobro de agua potable en formato [pdf]'));
    }
}

function colocarDatosIniciales({
        codigo,
        cedula,
        nombres,
        apellidos,
        total,
        consumoFinal,
        deuda
},partes=false) {
    const date = document.getElementById('date');
    const hour = document.getElementById('hour');
    const cedulaIn = document.getElementById('cedula');
    const names = document.getElementById('name');
    const lastnames = document.getElementById('lastname');
    const consumo = document.getElementById('consumo');
    const totalF = document.getElementById('total');
    const deudaHtml = document.getElementById('deuda-pdf');
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

    if(partes){
        deudaHtml.textContent = deuda + '$';
    }else{
        deudaHtml.textContent = '0$';
    }

    id.innerHTML = codigo;
}

async function actualizarValores(codigo,dataComision) {
    const  button = document.getElementById('recaudacion');
    const data = {
        codigo,
        data: {
            comision: 1,
            mora: 0,
            deuda:0
        }
    }
    // realizar el conbro hacia la tabla cobros
    const {ident,mensaje} = await window.modelCobro.addCobro(dataComision);
    if(ident) {
        const {ident, mensaje} = await window.modelCobro.updateEstado(data);
        if(ident) {
            presentacionDatos(codigo); 
    
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


async function cobrosPorPartes(datos) {
    const button = document.getElementById('deuda');
    button?.addEventListener('click' , (e) => {
    const {codigo,total} = datos;
    const div = document.createElement('div');
    div.className = 'modal fade';
    div.setAttribute('data-bs-backdrop','static');
    div.setAttribute('data-bs-keyboard','false');
    div.tabIndex = '-1';
    const modal = `
    <!-- Modal -->
    <form data-id="${codigo}">

    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5" id="staticBackdropLabel">Recaudación por partes.</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <p class="p-2 mb-2">
                Esta sección le permite realizar el cobro del agua potable por partes,
                eso quiere decir que si una persona no contiene el efectivo suficiente para
                pagar el recivo completo puede ingresar un valor inicial de pago, 
                el sistema realizara la labor guardar el restante para que en un futuro 
                pueda pagar de manera completa.
            </p>
            <div class="w-10">
                <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">Total de pago de cobro de agua potable</label>
                    <input type="text" disabled class="form-control" value="${total}$">
                    <div id="emailHelp" class="form-text">Este es total a pagar en la seccion inferior ingrese un valor menor o igual a este.</div>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Ingrese el monto a pagar por partes</label>
                    <input type="number"  step="0.01" class="form-control" max="${total}" min="0" required>
                </div>
                <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">Monto de pago restante</label>
                    <input type="text" disabled id="restante" class="form-control">
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary">Recaudar</button>
        </div>
        </div>
    </div>
    </form>

    `;
    div.innerHTML = modal;
    const myModal = new bootstrap.Modal(div, {});

    myModal.show();
    const form = div.querySelector('form');
    div.addEventListener('hide.bs.modal',(e) => {
        div.remove();
    })
    const inputMont = form.querySelector('input[type=number]');
    const restante = form.querySelector('#restante');
    
    form.addEventListener('submit',e => cobrarPartes(e,myModal,datos));
    inputMont.addEventListener('input',() => {
        const monto = parseFloat(inputMont.value.trim()).toFixed(2);
        const pago = total - monto;
   
        if(inputMont.value.trim() === '') {
            restante.value = total + '$';
            return;
        }
        restante.value = pago.toFixed(2) + '$';
    })
})

}

async function cobrarPartes(e,modal,datos) {
    e.preventDefault();
    const form = e.target;
    const codigo = form.dataset.id;
    const monto = parseFloat(form.querySelector('input[type=number]').value.trim()).toFixed(2);
    const total = parseFloat(form.querySelector('input[type=text]').value.trim()).toFixed(2);
    const pago = total - monto;
    if(!(pago >= 0)) {
        alerta('alert-warning','Por favor ingrese un valor correcto para el monto a pagar.',3000);
        return;
    }
    const data = {
        codigo: codigo,
        data:{
            deuda: pago,
            mora: 0,
            comision: true
        }
    };
    datos.total = monto;
    datos.deuda = parseFloat(pago).toFixed(2);
    colocarDatosIniciales(datos,true);
    const comisionTable = {
        ingreso: monto,
        id_casa: codigo
    };
    const {ident,mensaje} = await window.modelCobro.addCobro(comisionTable);
    if(ident) {
        const {ident, mensaje} = await window.modelCobro.updateEstado(data);
        if(ident) {
            presentacionDatos(codigo); 
    
        }else {
            alerta('alert-danger','A ocurrido un error al momento de generar la recaudación,por favor intentelo más tarde.',4000);
        }
        
    }else{
        alerta('alert-danger','A ocurrido un error al momento de generar la recaudación,por favor intentelo más tarde.')
    }
    modal.hide();
    activarReporte(codigo,datos,true);
}