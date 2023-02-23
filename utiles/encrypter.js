const {compare,hash} = require('bcryptjs');


async function encrypt(string) {
    return await hash(string,10);
}

async function verifyHash(clave, hash) {
    return await compare(clave,hash);
}

module.exports = {
    encrypt,
    verifyHash
}