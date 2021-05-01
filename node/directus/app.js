const directusConfig = require('../config').directus;
const Directus =  require('@directus/sdk').Directus;

const directus = new Directus(directusConfig.url);

async function login() {
    await directus.auth.login({
        email: directusConfig.email,
        password: directusConfig.password,
    });
}

async function query() {
    const articles = await directus.items('articles').readMany();
    console.log({
        items: articles.data,
        total: articles.data.length,
    });
}

async function queryCustomApi() {
    const articles = await directus.items('my-endpoint').readMany();
}

async function main() {
    await login();
    // await query();
    await queryCustomApi();
}

main();