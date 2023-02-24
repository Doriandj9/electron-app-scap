import newPage from "./utiles/newPage.js";
import alerta from "../../utiles/alertasBootstrap.js";

export  function init(){
    newPage('sector.html')
    .then(run)
    .catch(console.log)
}

function run(){
    listarSectores();
    const form = document.getElementById('form-sector');
    form.addEventListener('submit',habiliarForm);
}


async function listarSectores() {
    const {ident,data} = await window.modelSector.allSector();
    let html = '';
    if(data.length === 0) return;
    data.forEach((d,i) => {
        const {dataValues} = d;
        html += `<tr>
                    <td>${i + 1}</td>
                    <td>${dataValues.codigo}</td>
                    <td>${dataValues.detalle}</td>
                </tr>`
    });

    document.querySelector('tbody').innerHTML = html;
}


async function habiliarForm(e) {
    e.preventDefault();
    const form = this;
    const [codigo,detalle] = form.querySelectorAll('input');
    if(codigo.value.trim() === '' || 
        detalle.value.trim() === ''
    ){
        alerta('alert-warning','Por favor, ingrese todos los campos.',1000);
        return;
    }
    const data = {
        codigo: codigo.value.trim(),
        detalle: detalle.value.trim()
    };

    const res = await window.modelSector.addSector(data);

    if(res.ident) {
        alerta('alert-success','Se ingreso correctamente el sector.',1000);
        codigo.value = detalle.value = '';
        listarSectores();
    }else{
        alerta('alert-danger',res.mensaje,2000);
    }

}