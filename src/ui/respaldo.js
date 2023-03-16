import newPage from "./utiles/newPage.js";

export function init() {
    newPage('respaldo.html')
    .then(run)
    .catch(console.log);
}

function run(){
    const button = document.getElementById('backup');

    button.addEventListener('click',backup);
}



async function backup(e){

  const res =  await window.database.backup();

  console.log(res);
}