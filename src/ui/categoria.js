import newPage from "./utiles/newPage.js";
import alerta from "./../../utiles/alertasBootstrap.js";

export function init() {
    newPage('categoria.html')
    .then(run)
    .catch(console.log);
}

function run() {
    listCategories();
    const form = document.getElementById('form-category');
    form.addEventListener('submit',envioDatos);
    opInputs();
}

async function envioDatos(e) {
    e.preventDefault();
    const form = e.target;
    const [nombre, precio,max_agua] = form.querySelectorAll('input');
    
    if(nombre.value.trim() === '' ||
        precio.value.trim() === ''
    ){
        alerta('alert-warning','Por favor, ingrese todos los campos.',1000);
        return;
    }

    const data = {
        nombre: nombre.value.trim(),
        precio: precio.value.trim().replace('$',''),
        max_agua: max_agua?.value?.trim().replace('m3','')
    };

    const res = await window.menuValues.addCategory(data)
    if(res.ident){
        alerta('alert-success','Se ingreso correctamente los datos.',1000);
        nombre.value = precio.value = max_agua.value = '';
        listCategories();
    }else{
        alerta('alert-danger',res.mensaje,2000);
    }    
}

async function listCategories() {
    const {ident, data} = await window.menuValues.allCategory()
    let html = '';
    data.forEach((d ,i)=> {
        const {dataValues} = d;
        html += `
        <tr>
            <td>${i+1}</td>
            <td>${dataValues.nombre}</td>
            <td>${dataValues.precio}</td>
            <td>${dataValues.max_agua}</td>
        </tr> 
        `;
    });
    document.querySelector('tbody').innerHTML = html;
}

function opInputs() {
    const price = document.querySelector('#price');
    const limit = document.querySelector('#limit');
    const expres = /(^[0-9]+)$/;
    price.addEventListener('input', () => {
        if(!expres.test(price.value.trim())){
            let valor = price.value.trim().split('');
            valor.pop();
            price.value = valor.join('');
        }
    })
    price.addEventListener('change',() => {
        price.value = price.value + '$';
    })
    limit.addEventListener('input', () => {
        if(!expres.test(limit.value.trim())){
            let valor = limit.value.trim().split('');
            valor.pop();
            limit.value = valor.join('');
        }
    })
    limit.addEventListener('change',() => {
        limit.value = limit.value + 'm3';
    })
}

