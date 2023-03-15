import newPage from "./utiles/newPage.js";
import alerta from "../../utiles/alertasBootstrap.js";

const panel = `
    <div class="ms-PanelExample">
    <div class="ms-Panel ms-Panel--left">
    <button class="ms-Panel-closeButton ms-PanelAction-close">
        <i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>
    </button>
    <div class="ms-Panel-contentInner">
        <p class="ms-Panel-headerText">Opciones de Consultas</p>
        <div class="ms-Panel-content">
        <nav class="">
            <ul class="list-unstyled">
                <li id="uno" class="d-flex gap-2 pointer">
                <i class="ms-Icon ms-Icon--DropboxLogo text-primary fw-bold h3"></i> 
                <span class="font-monospace" style="line-height: 1.75rem;">Cosultar Caja</span> 
                </li>
                <li id="dos" class="d-flex gap-2 pointer">
                <i class="ms-Icon ms-Icon--CalendarDay text-primary fw-bold h3"></i> 
                <span class="font-monospace" style="line-height: 2.25rem;">Consulta Diaria o Mensual</span> 
                </li>
            </ul>
        </nav>
        </div>
    </div>
    </div>
    </div>
`;
export function init() {
    const div = document.createElement('div');
    div.innerHTML = panel;
    document.body.prepend(div);

    let PanelExamples = document.getElementsByClassName("ms-PanelExample");
    for (let i = 0; i < PanelExamples.length; i++) {
    (function() {
        let PanelExamplePanel = PanelExamples[i].querySelector(".ms-Panel");
        new fabric['Panel'](PanelExamplePanel);
        events();
    }());
    }
    
function events(){
    const panel = document.querySelector('.ms-PanelHost');
    const op1 = document.querySelector('li#uno');
    const op2 = document.querySelector('li#dos');
    op1.addEventListener('click',() => {
        panel.remove();
        newPage('consulta-uno.html')
        .then(runCaja)
        .catch(console.log);
    })
    op2.addEventListener('click',() => {
        panel.remove();
        newPage('consulta-dos.html')
        .then(runDom)
        .catch(console.log);
    })
}
}
async function runCaja() {
    const date= new Date();
    const formatDate = Intl.DateTimeFormat('es',{
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format;

    const {ident,data} = await window.modelConsulta.all();

    let caja = 0;

    data.forEach(d => {
        const {dataValues} = d;
        caja += parseFloat(dataValues.ingreso)
    });

    const html  = `
    <tr>
        <td>1</td>
        <td>${formatDate(date)}</td>
        <td>${parseFloat(caja).toFixed(2)}$</td>
    </tr>
    `;
    document.querySelector('tbody').innerHTML = html;
} 

function runDom() {
 
    const selectOption = document.getElementById('opciones');
    const select = document.getElementById('listOptions');
    const input = document.getElementById('input-date');
    selectOption.addEventListener('change',() => {
        if(selectOption.value.trim() == 'mes'){
            input.classList.add('d-none');
            select.classList.remove('d-none');
            return;
        }

        if(selectOption.value.trim() == 'dia'){
            input.value = '';
            input.classList.remove('d-none');
            select.classList.add('d-none');
            input.type = 'date';
            return;
        }

        if(selectOption.value.trim() == 'anio'){
            input.value = '';
            input.classList.remove('d-none');
            input.type = 'text';
            input.placeholder = 'Por ejemplo: 2023';
            select.classList.add('d-none');
            return;
        }
    })
    const button = document.getElementById('busqueda-consultas');
    button.addEventListener('click',consultaGeneral);
}

function consultaGeneral() {
    const selectOption = document.getElementById('opciones');
    const select = document.getElementById('listOptions');
    const input = document.getElementById('input-date');
    const date = new Date();
    const format = Intl.NumberFormat('es',{
        minimumIntegerDigits: 2
    }).format
    const year = date.getFullYear();
    const queryMonth = `${year}-${format(select.value.trim())}-01 ${select.value.trim() === '12' ? year +1 : year}-${select.value.trim() === '12' ? '01': format((parseInt(select.value.trim())) + 1)}-01`
    const queryYear = `${input.value.trim()}-01-01 ${(parseInt(input.value.trim())) + 1 }-01-01`;
    const queryDay = `${input.value} ${input.value}`; 

   const querys = [['dia',() => presentarDatos(queryDay)],
   ['mes',() => presentarDatos(queryMonth)],
   ['anio', () => presentarDatos(queryYear)]
   ]
    const map = new Map(querys);
    const functionQuery = map.get(selectOption.value.trim());
    functionQuery();
}


async function presentarDatos(valor){
    if(valor.trim() === '') {
        alerta('alert-warning','Por favor ingres un valor para continuar',2000);
        return;
    }

    const data = {start: valor.split(' ')[0],end: valor.split(' ')[1]}

    const {ident,data:valores} = await window.modelConsulta.queryOp(data);
    if(ident && valores.length > 0){
        const formatDate = Intl.DateTimeFormat('es',{
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format;
        let caja = 0;

        valores.forEach(d => {
            caja += parseFloat(d.ingreso)
        });

        const html  = `
        <tr>
            <td>1</td>
            <td>${data.start} hasta ${data.end}</td>
            <td>${parseFloat(caja).toFixed(2)}$</td>
        </tr>
        `;
        document.querySelector('tbody').innerHTML = html;
    }else{
        alerta('alert-danger','No se econtro datos en en esas fechas establecidas.',2500);
    }
}

