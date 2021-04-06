const redis = require('redis');
const redisConfig = require('../config').redis;


/**
 * Use params structure redis client: const client = redis.createClient(redisConfig.port, redisConfig.host, {auth_pass: redisConfig.password, db: redisConfig.database});
 * Use url structure redis client: const client = redis.createClient(redisConfig.port, redisConfig.host, {auth_pass: redisConfig.password, db: redisConfig.database});
 */ 
function createClientAndListen() {
    const client = redis.createClient(redisConfig.url);
    client.on('connect',function(){
        console.log('[redis connect]', 'start');
    });
    client.on('ready',function(res){
        console.log('[redis connect]', 'success');
    });
    client.on('error', function (err) {
        console.log('[redis connect]', 'error:', err);
    });
    client.on('end',function(err){
        console.log('[redis connect]', 'end');
    });
    return client;
}



function main() {
    const client = createClientAndListen();

    /**
     * hask operate
     */
    // client.hset("hash_key", "hashtest_1", "some value", (err, reply) => console.log(reply));
    // client.hset(["hash_key", "hashtest_2", "some other value"], (err, reply) => console.log(reply));
    // client.hset(["hash_key", "hashtest_3", "some other value 333"], (err, reply) => console.log(reply));
    // client.hkeys("hash_key", function (err, replies) {
    //     console.log("hash_key:", replies);
    //     replies.forEach(function (reply, i) {
    //         client.hget("hash_key", reply, redis.print);
    //     });
    //     client.quit();
    // });
    // client.quit();

    /**
     * string operate
     */
    client.set("string_key", "string_val", redis.print);
    client.get("string_key", redis.print);
    client.get("string_key", (err, reply) => console.log(reply));

    /**
     * TODO: refresh password
     */

    client.quit();
}

// run
main();

