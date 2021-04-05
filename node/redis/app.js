const redis = require('redis');
const redisConfig = require('../config').redis;
const redisOpts = {auth_pass: redisConfig.password};
const client = redis.createClient(redisConfig.port, redisConfig.host, redisOpts);


client.on('connect',function(){
    console.log('redis connect success!');
});

client.on('ready',function(res){
    console.log('ready');
});
              
client.on('error', function (err) {
    console.log('error', err);
});

client.on('end',function(err){
    console.log('end');
});


client.set("string_key", "string_val", redis.print);
client.get("string_key", redis.print);
client.get("string_key", (err, reply) => console.log(reply));

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

setTimeout(() =>client.quit(), 800);



