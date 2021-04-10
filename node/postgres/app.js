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

    console.log("==============Schema List==================")
    const querySchemaListResult = await pool.query(`select * from pg_namespace;`);
    const schemas = querySchemaListResult.rows;
    console.table(schemas);

    // console.log("==============Database List==================")
    // const queryDatabaseListResult = await pool.query('select db.datname, db.datacl, pg_size_pretty(pg_database_size(db.datname)) as size, pg_catalog.pg_get_userbyid(db.datdba) as owner from pg_database db;');
    // const databases = queryDatabaseListResult.rows;
    // console.table(databases);

    console.log("==============User List==================")
    const queryUserListResult = await pool.query(`select usename from pg_user;`);
    const users = queryUserListResult.rows;
    console.table(users);

}

async function revokePublicPrivilege() {
    await pool.query(`REVOKE CONNECT ON DATABASE postgres FROM PUBLIC;`);
    await pool.query(`revoke all on database postgres from PUBLIC;`);
    await pool.query(`revoke select on all tables in schema public from PUBLIC;`);
}

/**
 * create database & user
 */
async function createDatabaseAndUser() {

    const databaseName = await readSyncByRl('[Create Database]Please Input database name:');
    await pool.query(`CREATE database ${databaseName};`);
    await pool.query(`REVOKE CONNECT ON DATABASE ${databaseName} FROM PUBLIC;`);
    await pool.query(`revoke all on database ${databaseName} from PUBLIC;`);

    const userName = await readSyncByRl('[Create User]Please Input user name:');
    const password = genratePassword(99, true, true, true, false);
    await pool.query(`CREATE USER ${userName} WITH PASSWORD '${password}';`);

    await pool.query(`ALTER database ${databaseName} OWNER TO ${userName};`);
    await pool.query(`GRANT CONNECT ON DATABASE ${databaseName} TO ${userName};`);

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
    const databaseName = await readSyncByRl('[Drop Database]Please Input database name:');
    // close the connect about this database
    await pool.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname='${databaseName}' AND pid<>pg_backend_pid();`);
    // drop database
    await pool.query(`drop database if exists ${databaseName};`);
    console.log("==============Drop Database success=========");
}

async function refreshPassword() {
    console.log("==============Refresh User password==================")
    const userName = await readSyncByRl('[Refresh User password]Please Input user name:');
    const password = genratePassword(99, true, true, true, false);
    await pool.query(`alter user ${userName} with password '${password}';`);
    console.log("New Password======>");
    console.log("========================>");
    console.log("=============================>");
    console.log(`${userName}:${password}`);
    console.log("=============================>");
    console.log("=======================>");
    console.log("==================>");
}


async function createTable() {
    await pool.query(`CREATE TABLE COMPANY(
        ID INT PRIMARY KEY     NOT NULL,
        NAME           TEXT    NOT NULL,
        AGE            INT     NOT NULL,
        ADDRESS        CHAR(50),
        SALARY         REAL
     );`);
     pool.
}

async function main () {
    try {
        await showDatabaseInfo();
        // await revokePublicPrivilege();
    
        // await dropUser();
        // await dropDatabase();
        // await createDatabaseAndUser();
        // await refreshPassword();
        // await createTable();
    } catch (e) {
        console.error("[main error]", e)
    }


    await pool.end();
}

main();