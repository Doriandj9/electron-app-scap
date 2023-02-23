import newPage from "./utiles/newPage.js";

export function init() {
    newPage('mora.html')
    .then()
    .catch(console.log);
}