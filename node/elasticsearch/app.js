const esConfig = require('../config').elasticsearch;
const url = new URL(esConfig.url);
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: esConfig.url })


async function cat() {
    const { IndicesBody } = await client.cat.indices({});
    console.log(IndicesBody);
}    

async function searchData() {
    const { body } = await client.search({
        index: 'book'
    })
    console.log(body);
}

async function main() {
    await cat();
    await searchData();
}

main()