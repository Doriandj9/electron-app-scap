const input = document.querySelector('input');
const reg = document.querySelector('.reg');
const star = performance.now();
console.time('vendor');
input.addEventListener('input', e => {
    e.preventDefault();
    import('./ConstExpres.js').then(object => {
        const {NUMBER_REG_EXPRE,EMAIL_REG_EXPRE,CEDULA_REG_EXPRE} = object;
        const veri = CEDULA_REG_EXPRE.test(input.value);
        if(veri){
            const div = reg.querySelector('div') || null;
            if(div){
                div.remove();
            }
            console.log('paso');
        }else{
            const menssage = document.createElement('div');
            const div = reg.querySelector('div') || null;
            if(div){
                div.remove();
            }
            menssage.textContent = 'Error asegurese de que ingresa una cedula valido';
            reg.append(menssage);
            
        }
       
    })
})
let o = {s: "test", n: 0};
localStorage.setItem('prueba',JSON.stringify(o,null,2));
reg.addEventListener('fullscreenchange',(e) => e.preventDefault());
console.timeLog('vendor');
