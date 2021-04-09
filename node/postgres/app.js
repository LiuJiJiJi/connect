const {
    Pool,
    Client
} = require('pg')
const connectionString = require('../config').postgres.url + '?max=20&idleTimeoutMillis=3000&connectionTimeoutMillis=2000';
const pool = new Pool({connectionString});


/**
 * show database info
 */
async function showDatabaseInfo() {
    // const res = await pool.query('SELECT NOW()');
    // console.log(res);
    console.log("==============Database List==================")
    const queryDatabaseListResult = await pool.query('select pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) as size from pg_database;');
    const databases = queryDatabaseListResult.rows;
    console.table(databases);

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

    console.log("==============Space List==================")
    const querySpaceListResult = await pool.query('select spcname from pg_tablespace;');
    const spaces = querySpaceListResult.rows;
    for (let i = 0; i < spaces.length; i++) {
        const space = spaces[i];
        const querySpaceSizeResult = await pool.query(`select pg_size_pretty(pg_tablespace_size('${space.spcname}')) as size;`);
        space.spaceSize = querySpaceSizeResult.rows[0].size;
    }
    console.table(spaces);

}

/**
 * create database & user
 */
async function showDatabaseInfo() {

}

async function main () {
    await showDatabaseInfo();



    await pool.end();
}

main();