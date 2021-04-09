const table = require('table').table;
const genratePassword = require('../util/generateUtil').generatePassword;
const faker = require('faker');
const assert = require('assert');
const _ = require('lodash');
const readSyncByRl = require('../util/fsUtil').readSyncByRl;
const mongoose = require('mongoose');
const Admin = mongoose.mongo.Admin;
const MUUID = require('uuid-mongodb');
const mongoConfig = require('../config').mongo;
const url = new URL(mongoConfig.url);
const createStream = require('table').createStream;
const Cat = mongoose.model('Cat', {
    name: String,
    sex: String,
    desc: String
});

/**
 * mongoose connect
 */
async function connect() {
    /**
     * suport mongoose@4
     */
    // mongoose.Promise = global.Promise;
    return mongoose.connect(mongoConfig.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}


/**
 * mongoose insert data
 */
async function saveData() {
    const kitty = new Cat({
        name: faker.name.findName(),
        sex: _.sample(['man', 'femal', 'unknown']),
        desc: _.sample(['I am an cat!', 'To be an cat!', 'Funny cat'])
    });
    return new Promise((resolve, reject) => {
        kitty.save(function (err, doc) {
            if (err) return reject(err);
            console.log('[mongo save data result success]:', doc);
            return resolve(doc);
        });
    })
}

/**
 * mongoose update data
 */
async function updateData() {
    await Cat.updateMany({
        sex: 'man'
    }, {
        desc: _.sample(['I am an cat!', 'To be an cat!', 'Funny cat'])
    });
}

/**
 * mongoose find data
 */
async function findData() {
    const cats = await Cat.find({});
    const data = [
        ['index', '_id', 'name', 'sex', 'desc'],
    ];
    cats.forEach((item, i) => {
        data.push([i + 1, item.id, item.name, item.sex, item.desc])
    })
    console.log(table(data));
    return cats;
}

/**
 * mongoose remove data
 */
async function removeData() {
    await Cat.remove({});
}

/**
 * mongodb show database list
 */
async function showDatabases() {
    const db = await mongoose.connection.db;
    console.log('==========database list==========');
    // database list
    return new Promise((resolve, reject) => {
        new Admin(db).listDatabases((err, result) => {
            if (err) reject(err);
            const databases = result.databases;
            result.databases.forEach((item) => {
                item.sizeOnDisk = (item.sizeOnDisk / 1024 / 1024).toFixed(2) + '/MB'
            })
            console.table(databases);
            return resolve();
        });
    })
}

/**
 * show collection list
 */
async function showCollections() {
    const db = await mongoose.connection.db;
    // current database collection 
    console.log('==========current database collection list==========');
    const collections = await db.collections();
    const tableDatas = [];
    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        const collectionName = collection.collectionName;
        const stats = await db.command({
            collStats: collectionName
        });
        const size = (stats.storageSize / 1024 / 1024).toFixed(2) + '/MB';
        const count = await collection.estimatedDocumentCount({});
        tableDatas.push({
            dbName: collection.dbName,
            collectionName,
            size,
            count
        })
    }
    console.table(tableDatas);


}

/**
 * mongodb show db info
 */
async function showUsers() {
    const db = await mongoose.connection.db;
    const systemUserCollection = db.collection('system.users');
    const users = await systemUserCollection.find({})
    let stream = createStream({
        columnDefault: {
            width: 50
        },
        columnCount: 5,
        columns: {
            0: {
                width: 15,
                alignment: 'left'
            },
            1: {
                width: 40,
                alignment: 'center'
            },
            2: {
                width: 15,
                alignment: 'left'
            },
            3: {
                width: 15,
                alignment: 'left'
            },
            4: {
                width: 50,
                alignment: 'left'
            },
        }
    });
    stream.write(['_id', 'userId', 'user', 'database', 'roles']);
    await users.forEach(x => {
        const roles = JSON.stringify(x.roles);
        const userId = MUUID.from(x.userId).toString();
        stream.write([x._id, userId, x.user, x.db, roles]);
    })
    console.log();
}

/**
 * create database and user
 */
async function useDatabaseAndCreateUser() {
    const databaseName = await readSyncByRl('[Create User]Please Input database name:');
    const user = await readSyncByRl('[Create User]Please Input user name:');
    const connection = await mongoose.connection.useDb(databaseName);

    const db = await connection.db;
    if (!db.collection('test')) {
        await db.createCollection('test');
    }
    const password = genratePassword(99, true, true, true, false)
    await db.command({
        createUser: user,
        pwd: password,
        roles: [{
            "db": databaseName,
            "role": "readWrite"
        }]
    });
    setTimeout(() => {
        console.log("===========");
        console.log("===========");
        console.log("===========");
        console.log(`MONGODB_URL=mongodb://${user}:${password}@${url.hostname}:${url.port}/${databaseName}`);
        console.log("===========");
        console.log("===========");
        console.log("===========");
    }, 1000)

}

/**
 * refresh user password
 */
 async function refreshUserPassword() {
    const user = await readSyncByRl('[Refresh User Password]Please Input user name:');
    const databaseName = await readSyncByRl('[Refresh User Password]Please Input user\'s database name:');
    const connection = await mongoose.connection.useDb(databaseName);

    const db = await connection.db;
    if (!db.collection('test')) {
        await db.createCollection('test');
    }
    const password = genratePassword(99, true, true, true, false);
    await db.command({
        updateUser: user,
        pwd: password
    });
    setTimeout(() => {
        console.log("===========");
        console.log("===========");
        console.log("===========");
        console.log(`MONGODB_URL=mongodb://${user}:${password}@${url.hostname}:${url.port}/${databaseName}`);
        console.log("===========");
        console.log("===========");
        console.log("===========");
    }, 1000)

}

/**
 * drop user
 */
async function dropUser() {
    const user = await readSyncByRl('[Drop User]Please Input user name:');
    const databaseName = await readSyncByRl('[Drop User]Please Input user\'s database name:');
    const connection = await mongoose.connection.useDb(databaseName);
    const db = connection.db;
    await db.command({
        dropUser: user,
    })
}

/**
 * drop database
 */
async function dropDatabase() {
    console.log("==============[Drop Database is very dangrous] Please use with caution===================")
    const databaseName = await readSyncByRl('[Drop User]Please Input database name:');
    const connection = await mongoose.connection.useDb(databaseName);
    await connection.dropDatabase();
}

async function main() {
    /*=====================mongoose start==============================*/
    await connect();

    /**
     * user/database manage
     */
    await showUsers();
    await showDatabases();
    // await dropUser();
    // await dropDatabase();
    // await useDatabaseAndCreateUser();
    // await refreshUserPassword();
    // await showCollections();
    await showDatabases();
    await showUsers();


    /**
     * crud
     */
    // await saveData();
    // await updateData();
    // await removeData();
    // await findData();

    await mongoose.connection.close();
    /*=====================mongoose end==============================*/
}

// run
main();