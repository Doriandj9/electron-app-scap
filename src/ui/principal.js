import Notificacion from '../../utiles/Notificacion/Notificacion.js';

let backdrop = document.createElement('div');
const buttonSector = document.querySelector('button#sector');
const buttonCategoria = document.querySelector('button#add-category');
const buttonCliente = document.querySelector('button#cliente');
const buttonCasas = document.querySelector('button#casas');
const buttonCobros = document.querySelector('button#cobros');
const buttonConsultas = document.querySelector('button#consultas');
const buttonCompra = document.querySelector('button#compra');
const buttonAcometida = document.querySelector('button#acometida');
const buttonMedidor = document.querySelector('button#medidor');
const buttonMora = document.querySelector('button#mora');
const buttonRespaldo = document.querySelector('button#respaldo');
const buttonMetroCub = document.querySelector('button#valor-m3');

if(!localStorage.initApp){
    init();
}

function init() {
    printBacdrop();
    var example = document.querySelector(".docs-DialogExample-blocking");
    var dialog = example.querySelector(".ms-Dialog");
    var checkBoxElements = example.querySelectorAll(".ms-CheckBox");
    var actionButtonElements = example.querySelectorAll(".ms-Dialog-action");
    var ChoiceFieldGroupElements = document.querySelectorAll(".ms-ChoiceFieldGroup");
    var checkBoxComponents = [];
    var actionButtonComponents = [];
    // Wire up the dialog
    var dialogComponent = new fabric['Dialog'](dialog);
    // Wire up the checkBoxes
    for (var i = 0; i < ChoiceFieldGroupElements.length; i++) {
      checkBoxComponents[i] = new fabric['ChoiceFieldGroup'](ChoiceFieldGroupElements[i]);
    }
    // Wire up the buttons
    for (var i = 0; i < actionButtonElements.length; i++) {
      actionButtonComponents[i] = new fabric['Button'](actionButtonElements[i], actionHandler);
    }
    // When clicking the button, open the dialog
      dialogComponent.open();

    function actionHandler(event) {
    const opt = document.getElementById('name-junta')
    if(opt){
        localStorage.nombreJunta = opt.value.trim();
        localStorage.initApp = true;
        setDate();
        document.getElementById('nombre-junta').textContent = localStorage.nombreJunta;
    }
    backdrop.remove();
    }
};



function printBacdrop() {
    backdrop.className= 'backdrop-init';
    document.body.append(backdrop);
}




function verifiDisplay(button) {
    return button.classList.contains('d-none');
}

// opciones de los menus

buttonSector.addEventListener('click',() => {
    if(!verifiDisplay(buttonSector)){
        import('./sector.js')
        .then(obd => {
            const {init} = obd;
            init()
        })
        .catch(console.log);
   }
});
buttonCategoria.addEventListener('click',() => {
    if(!verifiDisplay(buttonCliente)){
        import('./categoria.js')
        .then(fun => {
            const {init} = fun;
            init();
        })
        .catch(console.log);
    }
})

buttonCliente.addEventListener('click',() => {
    if(!verifiDisplay(buttonCliente)){
        import('./cliente.js')
        .then(fun => {
            const {init} = fun;
            init();
        })
        .catch(console.log);
    }
})
buttonCasas.addEventListener('click',() => {
    if(!verifiDisplay(buttonCasas)){
        import('./casas.js')
        .then(fun => {
            const {init} = fun;
            init();
        })
        .catch(console.log);
    }
})
buttonCobros.addEventListener('click',() => {
    if(!verifiDisplay(buttonCobros)){
        import('./cobros.js')
        .then(fun => {
            const {init} = fun;
            init();
        })
        .catch(console.log);
    }
})
buttonConsultas.addEventListener('click',() => {
    if(!verifiDisplay(buttonConsultas)){
        import('./consultas.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})
buttonCompra.addEventListener('click',() => {
    if(!verifiDisplay(buttonCompra)){
        import('./compra.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})
buttonAcometida.addEventListener('click',() => {
    if(!verifiDisplay(buttonAcometida)){
        import('./acometida.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})
buttonMedidor.addEventListener('click',() => {
    if(!verifiDisplay(buttonMedidor)){
        import('./medidor.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})
buttonMora.addEventListener('click',() => {
    if(!verifiDisplay(buttonMora)){
        import('./mora.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})
buttonRespaldo.addEventListener('click',() => {
    if(!verifiDisplay(buttonRespaldo)){
        import('./respaldo.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})

buttonMetroCub.addEventListener('click',() => {
    if(!verifiDisplay(buttonMetroCub)){
        import('./metroC.js')
        .then(fun => {
            const {init} = fun;
            init();})
        .catch(console.log);
    }
})



if(localStorage.initApp){
    document.getElementById('nombre-junta').textContent = localStorage.nombreJunta;
    setDate();
}

function setDate(){
    const time  = new Date();
    const month = time.getMonth();
    const year = time.getFullYear();
    if(!localStorage.timeSend) localStorage.timeSend = time;
    if(!localStorage.validationRun) localStorage.validationRun = false;
    let timeInit = 'month-01-year';
    timeInit = timeInit.replace('year',year);
    timeInit = timeInit.replace('month',month + 1);
    timeInit = new Date(timeInit);
    let timeLimit = 'month-01-year'
    timeLimit = timeLimit.replace('year',year);
    timeLimit = timeLimit.replace('month',month + 2);
    timeLimit = new Date(timeLimit);
    const dateInfo = {
        timeInit: timeInit,
        timeFinish: timeLimit
    };
    const limitTimeCom = new Date(localStorage.timeSend)
    if(time.getTime() >= limitTimeCom.getTime() && 
        timeLimit.getTime() !== limitTimeCom.getTime()
    ){
        if(localStorage.initApp != 'true'){
            cargarMora();
        }
        localStorage.validationRun = false;
        localStorage.initApp = false;
    }

    localStorage.timeValues = JSON.stringify(dateInfo);
    if(time.getTime() <= timeLimit.getTime()){
        if(localStorage.validationRun && localStorage.validationRun == 'false')
        {
            comprobarCobros();
            localStorage.timeSend = timeLimit;
            localStorage.validationRun = true;
        }
    }

    
}

async function comprobarCobros() {
    const data = {
        comision: 0,
    }

    const {ident,mensaje} = await window.modelCobro.verifyCobros(data);

    if(!ident){
        new Notificacion('Erro: Un elemento importante para el funcionamiento de la aplicacion no se ejecuto correctamente, por favor reinicie la aplicacion, cierre y vuelva abrirlo.','Aceptar');
    }
    
}

async function cargarMora() {
    const {ident,data} = await window.modelCobro.loadMora();
}

