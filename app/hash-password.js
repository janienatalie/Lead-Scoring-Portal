const bcrypt = require("bcryptjs");

const password = "admin123";
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Hash untuk "admin123" adalah:');
console.log(hash);
