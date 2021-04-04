const redis = require('redis');
const config = require('../config');
const redisConfig = config.redis;
const redisOpts = {auth_pass: redisConfig.RDS_PWD};
const client = redis.createClient(redisConfig.RDS_PORT, redisConfig.RDS_HOST, redisOpts);

client.on('connect',function(){
    console.log('redis connect success!');
});

client.on('ready',function(res){
    console.log('ready');
});
              
client.on('error', function (err) {
    console.log(err);
});

client.on('end',function(err){
    console.log('end');
});


client.set("string_key", "string_val", redis.print);
client.get("string_key", redis.print);
client.get("string_key", function (err, reply) {
    console.log(reply);
});

client.hset("hash_key", "hashtest_1", "some value", redis.print);
client.hset(["hash_key", "hashtest_2", "some other value"], redis.print);
client.hset(["hash_key", "hashtest_3", "some other value 333"], redis.print);
client.hkeys("hash_key", function (err, replies) {
    console.group("hash_key:", replies);
    replies.forEach(function (reply, i) {
        client.hget("hash_key", reply, redis.print);
    });
    console.groupEnd();
    client.quit();
});


