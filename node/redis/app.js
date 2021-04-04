const redis = require('redis');
const config = require('../config');
const path  = require('path');
require('dotenv').config({ path: path.join(__dirname, '../', '.env')});
const redisConfig = config.redis;
const redisOpts = {auth_pass: process.env.REDIS_PWD};
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST, redisOpts);

// console.log('pwd:', process.cwd() + "/.env")
// console.log('__dirname:', __dirname)
// console.log('env path:', path.join(__dirname, '../', '.env'))

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
    console.log("hash_key:", replies);
    replies.forEach(function (reply, i) {
        client.hget("hash_key", reply, redis.print);
    });
    client.quit();
});


