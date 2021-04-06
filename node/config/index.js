const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', '.env')});

// console.log('pwd:', process.cwd() + "/.env")
// console.log('__dirname:', __dirname)
// console.log('env path:', path.join(__dirname, '../', '.env'))

module.exports = {
    redis: {
        host: process.env.MONGODB_HOST,
        port: process.env.REDIS_PORT,
        database: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_URL,
    },
    mysql: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        url: process.env.MYSQL_URL,
    },
    mongo: {
        url: process.env.MONGODB_URL
    }
}

