import Notificacion from './../../utiles/Notificacion/Notificacion.js';

const datosDB = document.getElementById('data-db');
const contentDB = document.getElementById('content-data')
const formDB = document.getElementById('form-data-db');
const formLogin = document.getElementById('form-login');
window.addEventListener('DOMContentLoaded',() => {
    const dialog =`
<div class="docs-DialogExample-lgHeader">
<div class="ms-Dialog ms-Dialog--lgHeader">
  <div class="ms-Dialog-title bg-danger">Error de la base de datos</div>
  <div class="ms-Dialog-content">
    <p class="ms-Dialog-subText">
        Por favor actualice los datos de la conección en la sección inferior, 
        dando un click en <br> <span class="text-primary"> "Actualizar datos de la base de datos" </span>
        <br>Luego ingrese al sistema.<br> Gracias.

    </p>
  </div>
  <div class="ms-Dialog-actions">
    <button class="ms-Button ms-Dialog-action  ms-Button--primary">
      <span class="ms-Button-label">Entendido</span> 
    </button>
  </div>
</div>
</div>
`;
    async function conect() {
        const res = await window.dbConect.conect();
        console.log(res);
        if(!res.ident){
            const div = document.createElement('div');
            div.innerHTML = dialog;
            document.body.append(div);
            dialogo(div);
        }
        function dialogo (div)  {
            try{
                var example = document.querySelector(".docs-DialogExample-lgHeader");
                // var button = example.querySelector(".docs-DialogExample-button");
                var dialog = example.querySelector(".ms-Dialog");
                var label = example.querySelector(".docs-DialogExample-label")
                var actionButtonElement = example.querySelector(".ms-Dialog-action");
                var actionButtonComponents = null;
                // Wire up the dialog
                var dialogComponent = new fabric['Dialog'](dialog);
                // Wire up the buttons
                  actionButtonComponents = new fabric['Button'](actionButtonElement, actionHandler);
                // When clicking the button, open the dialog
                  openDialog(dialog);
                function actionHandler(event) {
                  div.remove();
                }
                function openDialog(dialog) {
                  // Open the dialog
                  dialogComponent.open();
            }

            }catch(e){
                console.log(e);
                
            }
          }
    }
    conect();
})

datosDB.addEventListener('click',mostarFormDB);

function mostarFormDB(e){
    e.preventDefault();
    contentDB.classList.remove('d-none');
}

formDB.addEventListener('submit',actualizarDatos);

function actualizarDatos(e){
    e.preventDefault();
    const form  = e.target;
    const formData = new FormData(form);
    let data = {
        dbname: formData.get('dbname'),
        user: formData.get('user'),
        clave: formData.get('clave'),
        server: {
            host: formData.get('host'),
            dialect: 'mysql',
            port: parseInt(formData.get('port'))
        }
    };
    
    console.log(data);

    const dialog =`
    <div class="docs-DialogExample-lgHeader">
    <div class="ms-Dialog ms-Dialog--lgHeader">
      <div class="ms-Dialog-title bg-danger">Error de la base de datos</div>
      <div class="ms-Dialog-content">
        <p class="ms-Dialog-subText">
            Por favor actualice los datos de la conección en la sección inferior, 
            dando un click en <br> <span class="text-primary"> "Actualizar datos de la base de datos" </span>
            <br>Luego ingrese al sistema.<br> Gracias.
    
        </p>
      </div>
      <div class="ms-Dialog-actions">
        <button class="ms-Button ms-Dialog-action  ms-Button--primary">
          <span class="ms-Button-label">Entendido</span> 
        </button>
      </div>
    </div>
    </div>
    `;
        async function conect() {
            await window.dbConect.updateConect(data);
            const res = await window.dbConect.conectUpdateRes();
            console.log(res);
            if(!res.ident){
                const div = document.createElement('div');
                div.innerHTML = dialog;
                document.body.append(div);
                dialogo();
            }else {
                const div = document.createElement('div');
                if(!localStorage.login){
                  div.innerHTML = `<div class="docs-DialogExample-lgHeader" >
                  <div class="ms-Dialog ms-Dialog--lgHeader" style="width: 75rem;">
                    <div class="ms-Dialog-title">Exito, ahora por favor ingrese un usuario administrador</div>
                    <div class="ms-Dialog-content">
                      <form class=" border p-3 border-1 border-dark-subtle" id="form-category">
                          <div class="mb-3">
                            <label class="ms-Label is-required">Ingrese un nombre de usuario</label>
                            <input id="user-init" type="text" class="ms-TextField-field fw-bold" placeholder="Por ejemplo: juan@administrador">
                            <div id="emailHelp" class="form-text">Se le recomienda ingresar un @ para que el usuario no sea un nombre comun</div>
                          </div>
                          <div class="mb-3">
                              <label class="ms-Label is-required">Ingrese el una contaseña</label>
                              <input id="clave-init" type="text" class="ms-TextField-field fw-bold" placeholder="Por ejemplo: admin022#123">
                              <div id="emailHelp" class="form-text">Esta contraseña sera encryptada para mayor seguridad</div>
                          </div>
                      </form>
                    </div>
                    <div class="ms-Dialog-actions">
                      <button class="ms-Button ms-Dialog-action  ms-Button--primary">
                        <span class="ms-Button-label">Agregar</span> 
                      </button>
                    </div>
                  </div>
                  </div>
                  `;
                  document.body.prepend(div);
                  dialogo(div,'user');
                  localStorage.login = true;
                }else{
                div.innerHTML = `
                <div class="docs-DialogExample-lgHeader">
                <div class="ms-Dialog ms-Dialog--lgHeader">
                  <div class="ms-Dialog-title">Exito</div>
                  <div class="ms-Dialog-content">
                    <p class="ms-Dialog-subText">
                        Se actualizaron correctamente los datos.<br>
                        Por favor, ingrese al sistema.
                    </p>
                  </div>
                  <div class="ms-Dialog-actions">
                    <button class="ms-Button ms-Dialog-action  ms-Button--primary">
                      <span class="ms-Button-label">Entendido</span> 
                    </button>
                  </div>
                </div>
                </div>
                `;
                document.body.prepend(div);
                dialogo(div);
              }

               
                formDB.classList.add('d-none');
            }
             function dialogo (div,option='')  {
                try{
                    var example = document.querySelector(".docs-DialogExample-lgHeader");
                    // var button = example.querySelector(".docs-DialogExample-button");
                    var dialog = example.querySelector(".ms-Dialog");
                    var label = example.querySelector(".docs-DialogExample-label")
                    var actionButtonElement = example.querySelector(".ms-Dialog-action");
                    var actionButtonComponents = null;
                    // Wire up the dialog
                    var dialogComponent = new fabric['Dialog'](dialog);
                    // Wire up the buttons
                      actionButtonComponents = new fabric['Button'](actionButtonElement, actionHandler);
                    // When clicking the button, open the dialog
                      openDialog(dialog);
                      async function actionHandler(event) {
                      if(option === 'user'){
                          const nombre = document.getElementById('user-init').value.trim();
                          const clave = document.getElementById('clave-init').value.trim();
                          const data = {
                            nombre,
                            clave
                          };
                          const {ident,mensaje} = await window.usuario.insert(data);
                          if(ident){
                            new Notificacion('Se ingreso correctamente el usuario ingreso al sistema','Aceptar',false);
                          }else{
                            new Notificacion('Error: No se ingreso el usuario,puede deberse a que el usuario ya existe, intentelo más tarde, cierre la aplicación y vuelva abrirla. ','Regresar');
                          } 
                          div.remove();
                      }else{
                        div.remove();
                      }
                    }
                    function openDialog(dialog) {
                      // Open the dialog
                      dialogComponent.open();
                }
    
                }catch(e){
                    console.log(e);
                    
                }
              }
        }
        conect();
}


// Envio de datos para comprobacion de usuario en la DB

formLogin.addEventListener('submit',(e) => {
  e.preventDefault();
  const user = formLogin.querySelector('#user').value.trim().toLowerCase();
  const pass = formLogin.querySelector('#password').value.trim();
  const data = {user,pass};
  autentification(data);
})

async function autentification(data){
  const res = await window.dbConect.loginAut(data);
  const div = document.createElement('div');
  const dialog =`
<div class="docs-DialogExample-lgHeader">
<div class="ms-Dialog ms-Dialog--lgHeader">
  <div class="ms-Dialog-title bg-danger">Error de autentificación.</div>
  <div class="ms-Dialog-content">
    <p class="ms-Dialog-subText">
        ${res.mensaje}
    </p>
  </div>
  <div class="ms-Dialog-actions">
    <button class="ms-Button ms-Dialog-action  ms-Button--primary">
      <span class="ms-Button-label">Regresar</span> 
    </button>
  </div>
</div>
</div>
`;
div.innerHTML = dialog;
document.body.prepend(div);
dialogo(div);

function dialogo(div)  {
  try{
      var example = document.querySelector(".docs-DialogExample-lgHeader");
      // var button = example.querySelector(".docs-DialogExample-button");
      var dialog = example.querySelector(".ms-Dialog");
      var label = example.querySelector(".docs-DialogExample-label")
      var actionButtonElement = example.querySelector(".ms-Dialog-action");
      var actionButtonComponents = null;
      // Wire up the dialog
      var dialogComponent = new fabric['Dialog'](dialog);
      // Wire up the buttons
        actionButtonComponents = new fabric['Button'](actionButtonElement, actionHandler);
      // When clicking the button, open the dialog
        openDialog(dialog);
      function actionHandler(event) {
        div.remove();
      }
      function openDialog(dialog) {
        // Open the dialog
        dialogComponent.open();
  }

  }catch(e){
      console.log(e);
      
  }
}
}