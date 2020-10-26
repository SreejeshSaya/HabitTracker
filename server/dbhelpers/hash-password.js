const bcrypt = require("bcrypt")

const password = process.argv[2]

console.log(bcrypt.hashSync(password,12))



