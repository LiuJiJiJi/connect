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
+ [mongodb](https://www.npmjs.com/package/mongodb)
    ```shell
    # update mysql conncet config on .env
    $ cd node
    $ node mongo/app.js
    ```


### Reference

+ [table](https://www.npmjs.com/package/table)
+ [lodash](https://lodash.com/docs)
+ generate password
    ```shell
    cd node
    vi util/generateUtil.js 
    # open the Line-50 annotation
    node util/generateUtil.js
    ```