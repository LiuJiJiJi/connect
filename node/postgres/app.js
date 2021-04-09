const {
    Pool,
    Client
} = require('pg')
const genratePassword = require('../util/generateUtil').generatePassword;
const readSyncByRl = require('../util/fsUtil').readSyncByRl;
const url = new URL(require('../config').postgres.url);
const connectionString = require('../config').postgres.url + '?max=20&idleTimeoutMillis=3000&connectionTimeoutMillis=2000';
const pool = new Pool({connectionString});


/**
 * show database info
 */
async function showDatabaseInfo() {

    // [size](https://blog.csdn.net/u013992330/article/details/106807311/?utm_medium=distribute.pc_relevant.none-task-blog-baidujs_baidulandingword-0&spm=1001.2101.3001.4242)
    console.log("==============Table List==================")
    const queryTablesListResult = await pool.query('select schemaname, tablename, tableowner from pg_tables;');
    const tables = queryTablesListResult.rows;
    for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const queryTableSizeResult = await pool.query(`select pg_size_pretty(pg_total_relation_size('${table.schemaname}.${table.tablename}')) as size;`);
        table.tableSize = queryTableSizeResult.rows[0].size;
    }
    console.table(tables);

    // console.log("==============Space List==================")
    // const querySpaceListResult = await pool.query('select spcname from pg_tablespace;');
    // const spaces = querySpaceListResult.rows;
    // for (let i = 0; i < spaces.length; i++) {
    //     const space = spaces[i];
    //     const querySpaceSizeResult = await pool.query(`select pg_size_pretty(pg_tablespace_size('${space.spcname}')) as size;`);
    //     space.spaceSize = querySpaceSizeResult.rows[0].size;
    // }
    // console.table(spaces);

    console.log("==============Database List==================")
    const queryDatabaseListResult = await pool.query('select pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) as size from pg_database;');
    const databases = queryDatabaseListResult.rows;
    console.table(databases);

    console.log("==============User List==================")
    const queryUserListResult = await pool.query(`SELECT u.usename AS "User name", u.usesysid AS "User ID", CASE WHEN u.usesuper AND u.usecreatedb THEN CAST('superuser, create database' AS pg_catalog.text)
                                                        WHEN u.usesuper THEN CAST('superuser' AS pg_catalog.text)
                                                        WHEN u.usecreatedb THEN CAST('create database' AS pg_catalog.text) ELSE CAST('' AS pg_catalog.text) END AS "Attributes"
                                                    FROM pg_catalog.pg_user u ORDER BY 1;`);
    const users = queryUserListResult.rows;
    console.table(users);

}

/**
 * create database & user
 */
async function createDatabaseAndUser() {
    const userName = await readSyncByRl('[Create User]Please Input user name:');
    const password = genratePassword(99, true, true, true, false);
    await pool.query(`CREATE USER ${userName} WITH PASSWORD '${password}';`);

    const databaseName = await readSyncByRl('[Create Database]Please Input database name:');
    await pool.query(`CREATE database ${databaseName};`);
    await pool.query(`GRANT ALL PRIVILEGES ON DATABASE ${databaseName} TO ${userName};`);

    console.log("======>");
    console.log("==============>");
    console.log("======================>");
    console.log(`POSTGRES_URL=postgres://${userName}:${password}@${url.hostname}:${url.port}/${databaseName}`);
    console.log("======================>");
    console.log("==============>");
    console.log("======>");
}


async function dropUser() {
    console.log("==============Drop User==================")
    const userName = await readSyncByRl('[Drop User]Please Input user name:');
    await pool.query(`drop owned by ${userName} cascade;`);
    await pool.query(`drop user if exists ${userName};`);
    console.log("==============Drop User success==========");
}

async function dropDatabase() {
    console.log("==============Drop Database is very dangrous")
    const databaseName = await readSyncByRl('[Creat Database]Please Input database name:');
    // close the connect about this database
    await pool.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname='${databaseName}' AND pid<>pg_backend_pid();`);
    // drop database
    await pool.query(`drop database if exists ${databaseName};`);
    console.log("==============Drop Database success=========");
}

async function main () {
    await showDatabaseInfo();

    // await dropUser();
    // await dropDatabase();
    await createDatabaseAndUser();

    await pool.end();
}

main();