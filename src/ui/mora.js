import newPage from "./utiles/newPage.js";

export function init() {
    newPage('mora.html')
    .then(run)
    .catch(console.log);
}

function run() {
    const form = document.getElementById('form-mora');
    const input = form.querySelector('input');
    form.addEventListener('submit',guardarDato);
    inputPrice(input);
    listarValor();
}

function guardarDato(e) {
    e.preventDefault();
    const form = e.target;

    const input = form.querySelector('input');

    if(input.value.trim().replace('$','') === '') {
        alerta('Por favor ingrese un valor para continuar',2000);
        return
    }

    localStorage.valorMora = input.value.trim().replace('$','');

    listarValor();

    input.value = '';

}

function inputPrice(price) {
    const expres = /(^[0-9 \.]+)$/;
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
}

function listarValor() {
const ui = document.getElementById('ui');
    if(localStorage.valorMora){
        ui.textContent = localStorage.valorMora + '$';
    }
}