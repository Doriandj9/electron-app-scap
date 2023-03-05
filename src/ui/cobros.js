import newPage from "./utiles/newPage.js";

export function init() {
    newPage('cobros.html')
    .then(run)
    .catch(console.log);
}

function run () {
    console.log('corriendo...');
}