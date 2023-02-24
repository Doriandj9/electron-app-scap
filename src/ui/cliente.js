import newPage from "./utiles/newPage.js";
import { EMAIL_REG_EXPRE, CEDULA_REG_EXPRE } from "../../utiles/RegularExpresions/ConstExpres.js";
import alerta from "../../utiles/alertasBootstrap.js";

export function init() {
    newPage('cliente.html')
    .then(run)
    .catch(console.log);
}

function run() {
    listarClientes();
    const form = document.querySelector('#form-cliente');
    form.addEventListener('submit',habilitarForm);

}

async function listarClientes() {
    const {ident,data} = await window.modelCliente.allCliente();
    let html = '';
    data.forEach((d,i) => {
        const {dataValues:datos} = d;
        const colors = {1: 'redDark',2:'blue',3:'black',4:'blueLight',5:'blueDark',6:'magenta'}
        html += `
        <div class="ms-PersonaCard">
        <div class="ms-PersonaCard-persona">
          <div class="ms-Persona ms-Persona--lg">
            <div class="ms-Persona-imageArea">
                <div class="ms-Persona-initials ms-Persona-initials--${colors[Math.ceil(Math.random() * 6)]}
                ">${datos.nombres.substring(0,2)}</div>
              </div>
            <div class="ms-Persona-presence">
              <i class="ms-Persona-presenceIcon ms-Icon ms-Icon--SkypeCheck"></i>
            </div>
            <div class="ms-Persona-details">
              <div class="ms-Persona-primaryText" title="${datos.nombres + ' ' + datos.apellidos}">
              ${datos.nombres.split(' ')[0] + ' ' + datos.apellidos.split(' ')[0]}</div>
              <div class="ms-Persona-secondaryText">CI: ${datos.cedula}</div>
              <div class="ms-Persona-tertiaryText">Cliente</div>
              <div class="ms-Persona-optionalText">Available at 4:00pm</div>
            </div>
          </div>
        </div>
        <ul class="ms-PersonaCard-actions">
            <li data-action-id="chat" class="ms-PersonaCard-action is-active" tabindex="1">
                <i class="ms-Icon ms-Icon--Org"></i>
              </li>
          <li data-action-id="phone" class="ms-PersonaCard-action" tabindex="2">
            <i class="ms-Icon ms-Icon--Phone"></i>
          </li>
          <li data-action-id="mail" class="ms-PersonaCard-action" tabindex="4">
            <i class="ms-Icon ms-Icon--Mail"></i>
          </li>
        </ul>
        <div class="ms-PersonaCard-actionDetailBox">
          <div data-detail-id="mail" class="ms-PersonaCard-details">
            <div class="ms-PersonaCard-detailLine"><span class="ms-PersonaCard-detailLabel">Personal:</span> 
              <a class="ms-Link" href="mailto:${datos.correo}">${datos.correo ? datos.correo : 'No disponible'}</a> 
            </div>
          </div>
          <div data-detail-id="chat" class="ms-PersonaCard-details">
            <div class="ms-PersonaCard-detailLine"><span class="ms-PersonaCard-detailLabel">Cédula:</span> 
              <span class="ms-TextField--placeholder" href="#">${datos.cedula}</span> 
            </div>
          </div>
          <div data-detail-id="phone" class="ms-PersonaCard-details">
            <div class="ms-PersonaCard-detailExpander"></div>
            <div class="ms-PersonaCard-detailLine">
              <span class="ms-PersonaCard-detailLabel">Personal:</span> 
              ${datos.telefono ? datos.telefono : 'No disponible'}
            </div>
          </div>
          <div data-detail-id="video" class="ms-PersonaCard-details">
            <div class="ms-PersonaCard-detailLine"><span class="ms-PersonaCard-detailLabel">Skype:</span> 
              <a class="ms-Link" href="#">Start Skype call</a> 
            </div>
          </div>
        </div>
      </div>
        `;
    });
    document.querySelector('#cards').innerHTML = html;  

    let PersonaCardElement = document.querySelectorAll(".ms-PersonaCard");
    for (let i = 0; i < PersonaCardElement.length; i++) {
      new fabric.PersonaCard(PersonaCardElement[i]);
    }
}

async function habilitarForm(e) {
    e.preventDefault();
    const form = this;
    const [cedula,nombres,apellidos,correo,telefono] = form.querySelectorAll('input');
    if(!CEDULA_REG_EXPRE.test(cedula.value.trim())){
        alerta('alert-warning','La cédula ingresada es incorrecta.',2000);
        return;
    }
    if(nombres.value.trim() === '') {
        alerta('alert-warning','El campo del nombre no puede ir vacio.',2000);
        return;
    }
    if(apellidos.value.trim() === '') {
        alerta('alert-warning','El campo del apellido no puede ir vacio.',2000);
        return;
    }
    if(correo.value.trim() !== '' && !EMAIL_REG_EXPRE.test(correo.value.trim())) {
        alerta('alert-warning','El correo electronico ingresado es incorrecto.',2000);
        return;
    }

    const data = {
        cedula: cedula.value.trim(),
        nombres: nombres.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim(),
        telefono: telefono.value.trim()
    }
    const {ident,mensaje} = await window.modelCliente.addCliente(data);
    if(ident){
        alerta('alert-success','Se ingreso correctamente el cliente',1000);
        cedula.value = nombres.value = apellidos.value = correo.value = telefono.value = '';
        listarClientes();
    }else {
        alerta('alert-danger','Error, se puede deber a que el cliente ya existe o no se ingreso correctamente los datos.',3000);
    }
}