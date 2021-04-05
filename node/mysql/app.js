const mysql = require('mysql');
const genratePassword = require('../util/generateUtil').generatePassword;
const readSyncByRl = require('../util/fsUtil').readSyncByRl;
const mysqlConfig = require('../config').mysql; 
// User url connect
const connection = mysql.createConnection(mysqlConfig.url);
const url = new URL(mysqlConfig.url);
const currentDatabase = url.pathname.replace('/', '');
// Use param connect ---> If password contains special characters; you should use this style
// const connection = mysql.createConnection({
//     host     : mysqlConfig.host,
//     port     : mysqlConfig.port,
//     user     : mysqlConfig.user,
//     password : mysqlConfig.password,
//     database : mysqlConfig.database,
//     timezone : 'Asia/Shanghai', 
// });


async function query(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql,  function (error, results, fields) {
            if (error) return reject(error);
            return resolve(results);
        })
    })
}

/**
 * Show database info
 */
async function showDatabaseInfo() {
    const queryTablseSql = `select table_name from information_schema.tables where table_schema='${currentDatabase}';`;
    const tables = await query(queryTablseSql);
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const queryTableRowCountSql = `select count(1) count from ${table.table_name};`;
        const count = await query(queryTableRowCountSql).then(results=> results[0].count);
        console.log(table.table_name, count);
    }
    return tables;
}

/**
 * Drop database
 * @param {*} user 
 */
 async function dropDatabase() {
    console.error("=========================Drop Opreation is very dangrous! Please proceed with caution!!")
    const database = await readSyncByRl('[Drop Database]Please Input database name:');
    const sql = `drop database if exists ${database};`
    return query(sql);
}

/**
 * Drop user
 * @param {*} user 
 */
 async function dropUser() {
    console.error("=========================Drop Opreation is very dangrous! Please proceed with caution!!")
    const user = await readSyncByRl('[Drop User]Please Input user name:');
    const sql = `drop user if exists'${user}'@'%';`
    return await query(sql);
}

/**
 * Drop table
 */
 async function dropTable() {
    console.error("=========================Drop Opreation is very dangrous! Please proceed with caution!!")
    const table = await readSyncByRl('[Drop table]Please Input table name:');
    const sql = `drop table if exists ${table};`
    return query(sql);
}

/**
 * Update password
 * user: not root user
 */
 async function refreshPassword() {
    console.error("=========================Refresh Password")
    const user = await readSyncByRl(`[Refresh Password]Please Input user name:`);
    const newPassword = genratePassword(64, true, true, true, false);
    const sql = `update user set authentication_string=password('${newPassword}') where user='${user}';`
    console.group('Refresh Password');
    console.log(`MYSQL_USER=${user}`);
    console.log(`MYSQL_PASSWORD=${newPassword}`);
    console.groupEnd();
    await query(sql);
    return query('flush privileges;');
}

/**
 * Create table
 */
 async function createTable() {
    const table = await readSyncByRl('======[Create table]Please Input table name:');
    const sql = `create table ${table} (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        update_time timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;`
    return query(sql);
}

/**
 * Create database & user
 * Prepare: make sure you are use root account
 */
async function createNewDatabaseAndUsername() {
    return new Promise(async(resolve, reject) => {
        const newDatabase = await readSyncByRl('Please Input new database name:');
        const newUserName = await readSyncByRl('Please Input new user name:')
        const newUserPassword = genratePassword(64, true, true, true, false);

        console.group("new user")
        // check database
        const queryDatabaseSql = `select schema_name from information_schema.schemata where schema_name = '${newDatabase}';`
        const databases = await query(queryDatabaseSql);
        if (databases.length > 0) {
            return reject(`[create user error] database:${newDatabase} has exsit!`);
        }
        // check user
        const queryUserSql = `select host,user from user where user='${newUserName}';`
        const users = await query(queryUserSql);
        if (users.length > 0) {
            return reject(`[create user error] username:${newUserName} has exsit!`);
        }

        const createUserSql = `CREATE USER '${newUserName}'@'%' IDENTIFIED BY '${newUserPassword}';`
        const createDatabaseSql = `create schema ${newDatabase} default character set utf8mb4 collate utf8mb4_general_ci;`
        const grantDatabaseAuthToUser = `grant all on ${newDatabase}.* to '${newUserName}'@'%';`;
        await query(createUserSql);
        await query(createDatabaseSql);
        await query(grantDatabaseAuthToUser);
        await query('flush privileges;');
        console.log(`MYSQL_USER=${newUserName}`);
        console.log(`MYSQL_PASSWORD=${newUserPassword}`);
        console.log(`MYSQL_DATABASE=${newDatabase}`);
        console.log(`MYSQL_URL=mysql://${newUserName}:${newUserPassword}@${url.hostname}:${url.port}/${newDatabase}`);
        console.groupEnd();
        return resolve();   
    })

}






async function main() {
    connection.connect((err) => {
        if (err) throw Error(`[Mysql connect error]: ${err}`);
    });

    try {
        const databaseInfo = await showDatabaseInfo();
        console.log('table size:', databaseInfo.length);
        // await dropUser();
        // await dropDatabase();
        // await createNewDatabaseAndUsername();    
        // await dropTable();  
        // await createTable(); 
        // await refreshPassword();  

    } catch (e) {
        console.error("[main error]", e);
    }

    connection.end();
}

// run
main();