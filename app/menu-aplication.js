const {Menu} = require('electron');

const template = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Salir',
                accelerator: 'Ctrl + Q',
                role: 'exit',
                click(item,curret){
                    curret.close();
                }
            }
        ]
    },
    {
        label: 'Ventana',
        submenu: [
            {
                visible: true,
                label: 'Minimizar',
                role: 'minimaze',
                accelerator: "Ctrl+M",
                click(item, curret){
                    curret.minimize();
                }
            }

        ]
    },
    // {
    //     label: 'Ayuda',
    //     submenu: [
    //         {
    //             label: 'Deplegar Herramienta de desarrollador',
    //             accelerator: 'Ctrl+Mayus+I',
    //             click(menuItem,windowFocus) {
    //                 if(windowFocus) {
    //                     windowFocus.webContents.toggleDevTools();
    //                 }
    //             }
    //         },
    //         {
    //             label: 'Recargar',
    //             accelerator: 'Ctrl+R',
    //             click(menuItem,windowFocus) {
    //                 if(windowFocus) {
    //                     windowFocus.reload();
    //                 }
    //             }
    //         }
    //     ]
    // }
];


module.exports = Menu.buildFromTemplate(template);