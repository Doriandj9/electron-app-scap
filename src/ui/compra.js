import alerta from "../../utiles/alertasBootstrap.js";
import newPage from "./utiles/newPage.js";

export function init() {
    newPage('compra.html')
    .then(run)
    .catch(console.log);
}

function run() {
    verCaja();
    habilitandoForm();
    const form = document.getElementById('form-compras');
    form.addEventListener('submit',registrarCompra)
    listarCompras();
}


function habilitandoForm() {
    const price = document.getElementById('precio');
    const expres = /(^[0-9\.]+)$/;
    price.addEventListener('input', () => {
        if(!expres.test(price.value.trim())){
            let valor = price.value.trim().split('');
            valor.pop();
            price.value = valor.join('');
        }
    })
    price.addEventListener('change',() => {
        if(price.value.trim() === '$' ||price.value.trim() === '' ){
            price.value = '';
            return;
        }
        price.value = price.value + '$';
    })
}

async function verCaja() {
    const invert = document.getElementById('total');

    const {ident,data} = await window.modelConsulta.all();
    let caja = 0;
    data.forEach(d => {
        const {dataValues} = d;
        caja += parseFloat(dataValues.ingreso)
    });

    invert.value = caja.toFixed(2) + '$';
}

async function registrarCompra(e) {
    e.preventDefault();
    const form = e.target;
    const [nones,...inputs] = form.querySelectorAll('input');
    const price = inputs[1];
    const total = parseFloat(nones.value.trim());
    inputs.forEach(inp => {
        if(inp.value.trim() === '') {
            alerta('alert-warning','Existen entradas vacias por favor ingrese un valor.',2500);
            return;
        }
    });

    if(parseFloat(price.value.trim()) > total){
        alerta('alert-warning','El valor de precio invertido no puede ser mayor al capital de la empresa',3500);
        return;
    }
    
    const data = {
        nombre: inputs[0].value.trim(),
        precio: parseFloat(price.value.trim()),
        cantidad: inputs[2].value.trim()
    };

    const {ident,mensaje} = await window.modelCompra.insert(data);
    if(ident){
        inputs.forEach(inp => {
            inp.value = '';
        });
        alerta('alert-success',mensaje,2000);
        verCaja();
        listarCompras();
    }else{
        alerta('alert-danger',mensaje,4000);
    }

}

async function listarCompras() {
    const {ident,data} = await window.modelCompra.all();
    console.log(ident,data);
    let html ='';
    let precioTotal = 0;
    data.forEach((d,i) => {
        const {dataValues:dato} = d;
        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${dato.nombre}</td>
            <td>${dato.cantidad}</td>
            <td>${dato.precio}$</td>
        </tr>
        `;
        precioTotal += dato.precio;
    });
    html += `<tr>
        <td colspan="4" align="end"><strong>Total: </strong> ${parseFloat(precioTotal).toFixed(2)}$</td>
    </tr>`;

    if(data.length === 0){
        html = `<tr>
        <td colspan="4" class="text-center">
            <span class="h3 ">De momento no contiene compras realizadas.</span>
        </td>
      </tr>`;
    }
    document.querySelector('tbody').innerHTML = html;
}