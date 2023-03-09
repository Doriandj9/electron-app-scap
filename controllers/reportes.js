const { PDF } = require("@lesjoursfr/html-to-pdf");
const paht = require('path');
const target = paht.join(__dirname,'./../utiles/reporte.html');
const output = paht.join(__dirname, './reporte.pdf');

const pdf = new PDF(target, output);

const generateReporte = (data) => {
    pdf.render()
    .then(() => {
        console.log("PDF Generated Successfully!")
    })
    .catch((err) => {
        console.error("Failed to generate PDF because of ", err)
    });
}

module.exports = generateReporte;