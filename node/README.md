# node connect util

### start

```shell
yarn
cp -r .env.example .env
```
### connect to db
+ [redis](https://www.npmjs.com/package/redis)
    ```shell
    # update redis conncet config on .env
    $ cd node
    $ node redis/app.js
        ready
        Reply: OK
        Reply: string_val
        string_val
        end
    ```
+ [mysql](https://www.npmjs.com/package/mysql)
    ```shell
    # update mysql conncet config on .env
    $ cd node
    $ node mysql/app.js
        ╔═══════╤═════════════════╤═════════════════╤═════════════════╤═════════════════╗
        ║       │   table name    │ columns count   │ row count       │ size            ║
        ╟───────┼─────────────────┼─────────────────┼─────────────────┼─────────────────╢
        ║ 1     │  columns_priv   │ 7               │ 0               │ 0.00/MB         ║
        ╟───────┼─────────────────┼─────────────────┼─────────────────┼─────────────────╢
        ║ 2     │       db        │ 22              │ 5               │ 0.00/MB         ║
        ╟───────┼─────────────────┼─────────────────┼─────────────────┼─────────────────╢
        ║ 3     │   engine_cost   │ 6               │ 2               │ 0.02/MB         ║
        ╟───────┼─────────────────┼─────────────────┼─────────────────┼─────────────────╢
        ║ 4     │      event      │ 22              │ 0               │ 0.00/MB         ║
        ╟───────┼─────────────────┼─────────────────┼─────────────────┼─────────────────╢
        ║ 5     │      func       │ 4               │ 0               │ 0.00/MB         ║
        ╚═══════╧═════════════════╧═════════════════╧═════════════════╧═════════════════╝
    ```
+ [mongodb](http://mongodb.github.io/node-mongodb-native/3.6/api/) [mongoose](https://mongoosejs.com/docs/guide.html)
    ```shell
    # update mongodb conncet config on .env
    $ cd node
    $ node mongo/app.js
    ==========database list==========
    ┌─────────┬──────────┬────────────┬───────┐
    │ (index) │   name   │ sizeOnDisk │ empty │
    ├─────────┼──────────┼────────────┼───────┤
    │    0    │ 'admin'  │ '0.17/MB'  │ false │
    │    1    │ 'config' │ '0.11/MB'  │ false │
    │    2    │ 'local'  │ '0.07/MB'  │ false │
    │    3    │  'test'  │ '0.07/MB'  │ false │
    └─────────┴──────────┴────────────┴───────┘
    ==========current database collection list==========
    ┌─────────┬─────────┬──────────────────┬───────────┬───────┐
    │ (index) │ dbName  │  collectionName  │   size    │ count │
    ├─────────┼─────────┼──────────────────┼───────────┼───────┤
    │    0    │ 'admin' │ 'system.version' │ '0.03/MB' │   2   │
    │    1    │ 'admin' │  'system.users'  │ '0.04/MB' │   2   │
    └─────────┴─────────┴──────────────────┴───────────┴───────┘
    ```

### Generate Util

+ password
+ 
```shell
$ cd node
$ node util/generateUtil
```

### Reference

+ [table](https://www.npmjs.com/package/table)
+ [lodash](https://lodash.com/docs)
+ [why use `mongoose.Promise = global.Promise;`](https://stackoverflow.com/questions/51862570/mongoose-why-we-make-mongoose-promise-global-promise-when-setting-a-mongoo)   
+ [Random phone number website](https://fakenumber.net/phone-number/singapore)
+ [faker: Generate fake data](https://github.com/Marak/faker.js)
        