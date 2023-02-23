async function newPage(page){
    const div = document.createElement('div');
    const returnHtml = document.createElement('div');
    const content = document.createElement('div');
    content.className = 'd-flex gap-2 justify-content-center p-3 ms-bgColor-info cuadro-r';
    content.innerHTML = `<i class="ms-Icon ms-Icon--Back text-primary fw-bold h3"></i>
    <span class="font-monospace" style="line-height: 1.75rem;">Regresar</span> `;
    returnHtml.className = 'retorno';
    returnHtml.append(content);
    div.className = 'w-100 new-page animate__animated animate__fadeInLeftBig animate__faster';
    try {
    const query = await fetch('./../views/' + page)
    const text = await query.text();
    div.innerHTML = `
    <div class="container-fluid">${text}</div>
    `;
    div.prepend(returnHtml);

    document.body.append(div);
    content.addEventListener('click',() => {
        div.classList.remove('animate__fadeInLeftBig');
        div.classList.add('animate__fadeOutLeftBig');
        setTimeout(() => {
            div.remove();
        },500);
    })
    return true;
    } catch (error) {
        console.log(error);
        return false;    
    }
}

export default newPage;