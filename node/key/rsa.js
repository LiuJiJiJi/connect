
const NodeRSA = require('node-rsa');


async function main() {
    const key = new NodeRSA({ b: 512 });
    key.setOptions({ encryptionScheme: 'pkcs1' });
    const publicPem = key.exportKey('pkcs8-public-pem');
    const privatePem = key.exportKey('pkcs8-private-pem');
    console.log(publicPem);
    console.log(privatePem);
}

// run
main();