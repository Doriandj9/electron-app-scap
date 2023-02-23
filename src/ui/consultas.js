import newPage from "./utiles/newPage.js";

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
        .then()
        .catch(console.log);
    })
    op2.addEventListener('click',() => {
        panel.remove();
        newPage('consulta-dos.html')
        .then()
        .catch(console.log);
    })
}
}