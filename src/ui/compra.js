import VisualizadorPDF from "./../../utiles/VisualizadorPDF/VisualizadorPDF.js";
import newPage from "./utiles/newPage.js";

export function init() {
    newPage('compra.html')
    .then(run)
    .catch(console.log);
}

function run() {
    const button = document.getElementById('view');
    button.onchange = (e) => {
        const view = new VisualizadorPDF();
        view.habilitarESC();
        view.mostrar(e.target.files[0]);
    }
}

window.addEventListener('close.viewpdf',e =>{
    e.detail.remove();
})