import Notificacion from "./Notificacion.js";


const notification = new Notificacion('Se ha registrado el paciente Pablo Ortega Su número de historia clinica es: 12345',
'#5D8FC3','OK','#47C47F');

notification.done();


const notificacion2 = new Notificacion('Se ha registrado correctamente los signos vitales de ...','#5D8FC3','Entendido','#47C47F');

//notificacion2.done();


const notificacion_mal = new Notificacion('Error: No se registro al paciento por que ya exite anteriormente','red','Entendido','black');

notificacion_mal.done();

document.addEventListener('mouseleave', e => {
    console.log(e);
})