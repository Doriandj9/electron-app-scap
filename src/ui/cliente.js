import newPage from "./utiles/newPage.js";

export function init() {
    newPage('cliente.html')
    .then()
    .catch(console.log);
}