const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', '.env')});

// console.log('pwd:', process.cwd() + "/.env")
// console.log('__dirname:', __dirname)
// console.log('env path:', path.join(__dirname, '../', '.env'))

module.exports = {
    redis: {
        host: process.env.MONGODB_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    }
}

