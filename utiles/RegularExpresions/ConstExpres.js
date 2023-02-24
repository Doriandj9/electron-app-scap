const NUMBER_REG_EXPRE = /(^09[0-9]{8})\b/;
const EMAIL_REG_EXPRE = /([\w]+)@([a-z]+)\.([a-z])/i;
const CEDULA_REG_EXPRE = /(?<province>^[01][1-9]|[2][0-4]|30|10|20)(?<tercer>[0-6])(?<number>[0-9]{7})\b/;
const PERIODO_ACADEMICO = /(^[\d]{4}\b)-([\d]{4}\b)/;
const COREO_INST = /([\w]+)@(ueb|mailes)\.([a-z])/i;
export {NUMBER_REG_EXPRE, EMAIL_REG_EXPRE,CEDULA_REG_EXPRE,PERIODO_ACADEMICO,COREO_INST};