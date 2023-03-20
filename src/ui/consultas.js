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
    const buttonReport = document.getElementById('btn-report');
    const btnCambio = document.getElementById('cambio');
    const btnCaja = document.getElementById('caja-inf')
    const resT = document.querySelector('table');
    const date= new Date();
    const formatDate = Intl.DateTimeFormat('es',{
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format;
    const {ident,data} = await window.modelConsulta.all();
    const {identH,data:dataH} = await window.modelHistorial.all(); 
    btnCambio.addEventListener('click',() => cambioTable(dataH,resT))
    btnCaja.addEventListener('click',() => cambioCaja(data,resT));
    let caja = 0;
    let html = '';
    data.forEach((d,i) => {
        const {dataValues} = d;
        caja += parseFloat(dataValues.ingreso)

        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataValues.id_casa == '00-00' ? 'Caja Inicial': dataValues.id_casa}</td>
            <td>${dataValues.fecha}</td>
            <td>${parseFloat(dataValues.ingreso).toFixed(2)}</td>
        </tr>
        `;
    });

    html  += `
    <tr>
        <td colspan="9" align="end">
        <strong>Total de Caja: </strong> <span>${parseFloat(caja).toFixed(2)}$</span>
        </td>
    </tr>
    `;
    document.querySelector('tbody').innerHTML = html;
    document.getElementById('f-c').textContent = formatDate(date);
    buttonReport.addEventListener('click',generarReporte);
} 

function cambioTable(data,table) {
    const thead = table.querySelector('thead');
    thead.innerHTML = `<tr>
        <th>Nº</th>
        <th>Código de casa</th>
        <th>Tipo de pago</th>
        <th>Valor del pago </th>
        <th>Efectivo extraido</th>
        <th>Detalle de la compra</th>
        <th>Fecha compra</th>
        <th>Valor neto</th>
    </tr>`;

    let html = '';
    data.forEach((d,i) => {
        const {dataValues} = d;
        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataValues.id_casa == '00-00' ? 'Caja Inicial': dataValues.id_casa}</td>
            <td>${dataValues.tipo}</td>
            <td>${parseFloat(dataValues.pago).toFixed(2)}</td>
            <td>${parseFloat(dataValues.egreso ?? 0).toFixed(2)}</td>
            <td>${dataValues.detalle_compra}</td>
            <td>${dataValues.fecha_compra}</td>
            <td>${parseFloat(dataValues.ingreso).toFixed(2)}</td>
        </tr>
        `;
    });

    table.querySelector('tbody').innerHTML = html;
}
function cambioCaja(data,table) {
    const thead = table.querySelector('thead');
    thead.innerHTML = `<tr>
    <th>Nº</th>
    <th>Código de casa (planilla/acometida)</th>
    <th>Fecha</th>
    <th>Valor neto</th>
    </tr>`;

    let caja = 0;
    let html = '';
    data.forEach((d,i) => {
        const {dataValues} = d;
        caja += parseFloat(dataValues.ingreso)

        html += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataValues.id_casa == '00-00' ? 'Caja Inicial': dataValues.id_casa}</td>
            <td>${dataValues.fecha}</td>
            <td>${parseFloat(dataValues.ingreso).toFixed(2)}</td>
        </tr>
        `;
    });

    html  += `
    <tr>
        <td colspan="9" align="end">
        <strong>Total de Caja: </strong> <span>${parseFloat(caja).toFixed(2)}$</span>
        </td>
    </tr>
    `;

    table.querySelector('tbody').innerHTML = html;
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

function generarReporte(e) {
    // let nombre = prompt('Ingrese un nombre para el archivo a descargar');
      const report = document.getElementById('reporte');
      const resT = document.querySelector('table');
      const table = resT.cloneNode(true);
      report.append(table);
      report.classList.remove('d-none');
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
        .from(report)
        .save()
        .catch(e => console.log(e))
        .finally(() => {
            report.classList.add('d-none');
        })
        .then(alert('A continuación se procedera a descargar la factura de cobro de agua potable en formato [pdf]'));
}