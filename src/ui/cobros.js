import newPage from "./utiles/newPage.js";

export function init() {
    newPage('cobros.html')
    .then(run)
    .catch(console.log);
}

function run () {
    let SearchBoxElements = document.querySelectorAll(".ms-SearchBox");
    for (let i = 0; i < SearchBoxElements.length; i++) {
        new fabric['SearchBox'](SearchBoxElements[i]);
    }

    const busqueda = document.getElementById('busqueda-cobros');
    busqueda.addEventListener('click',busquedaDatos);
}

async function busquedaDatos(e) {
    e.preventDefault();
    const busqueda = document.getElementById('busqueda-text');
    
    const {ident,data} = await window.modelCobro.infoCobro(busqueda.value.trim());

    console.log(ident,data);
    const {
        apellidos,nombres,cedula,codigo,
        codigo_sector,consumo,direccion,
        medidor,nombre_categoria,nombre_sector,
        precio,valor_actual,valor_anterior
    } = data;
    const consumoFinal = valor_actual - valor_anterior;
    const sobrepasa = consumoFinal > parseInt(consumo.replace('m3','')) ? true : false;


    const adidcional = `
    <div class="card" style="width: 25rem;">
            <div class="card-header">
                <h5 class="card-title">Consumo adicional</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Valor de metro cubico: </strong>0.25ctvs</li>
                <li class="list-group-item"><strong>Consumo exedido: </strong>5m3</li>
            <li class="list-group-item"><strong>Sub Total : 0.25ctvs * 5m3 = <span class="text-primary">1.80ctvs</span></strong></li>
            <li class="list-group-item"><strong>Total a Pagar Final: 1.80ctvs + 3$ = <span class="text-primary">4.80ctvs</span></strong></li>

            </ul>
        </div>
    `;
    let html = `
    <div class="card-header">
        <h5 class="card-title">Datos del cobro del domicilio encontrado.</h5>
    </div>
    <div class="card-body">
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
            <li class="list-group-item"><strong>Total a Pagar: <span class="text-primary">3$</span></strong></li>

            </ul>
        </div>
        ${sobrepasa ? adidcional : ''}
    </div>
    <div class="d-flex justify-content-center mt-2">
        <button class="btn btn-primary">Realizar Recaudación</button>
    </div>
    </div>
    `;    
    document.getElementById('container-info').innerHTML = html;
}