export default class VisualizadorPDF {
    embed;
    div;
    constructor(){
        this.embed = document.createElement('embed');
        this.embed.type = 'application/pdf';
        this.embed.className = 'visualizador';
    }
    /**
     * 
     * @param {Blob} archivo
     */
    mostrar(archivo) {
        if(typeof archivo === 'blob') throw Error('No suminstro un archivo blob');
        if(archivo.size <= 100){
           return;
        }
        const urlObjet = URL.createObjectURL(archivo);
        this.embed.src = urlObjet;
        window.addEventListener('keydown',e => {
            if(e.key === 'Escape') {
                window.dispatchEvent(new CustomEvent('viewpdf',{detail:true}));
            }
           },{capture:true})
        window.dispatchEvent(new CustomEvent('viewpdf',{detail:false}));
        document.body.prepend(this.embed);
        // creamos la x para salir
        this.div = document.createElement('div');
        this.div.title = 'Salir del Visualizador';
        this.div.className = 'salir-vista';
        this.div.textContent = 'Salir de la visualización ❌.';
        this.div.addEventListener('click',e => {
            this.div.remove();
            window.dispatchEvent(new CustomEvent('viewpdf',{detail:true}));
        })
        document.body.prepend(this.div);
       const alert = document.createElement('div');
       alert.textContent = 'Puede precionar ESC para cerrar el visualizador';
       alert.className = 'alerta-visualizador';
       setTimeout(() => {alert.remove()},1000);
       document.body.prepend(alert);
    }

    habilitarESC(){
        window.addEventListener('viewpdf',e => {
           if(e.detail){
            this.div.remove();
            window.dispatchEvent(new CustomEvent('close.viewpdf',{detail:this.embed}));
           }
        })
    }
}