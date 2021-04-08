const table = require('table').table;
const faker = require('faker');
const assert = require('assert');
const _ = require('lodash');
const generateUtil = require('../util/generateUtil');
const mongoose = require('mongoose');
const MUUID = require('uuid-mongodb');
const url = require('../config').mongo.url;
const createStream = require('table').createStream;
const Cat = mongoose.model('Cat', { name: String , sex: String, desc: String});

/**
 * mongoose connect
 */
async function connect() {
    /**
     * suport mongoose@4
     */
    // mongoose.Promise = global.Promise;
    return mongoose.connect(url, {
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
    const kitty = new Cat({ name: faker.name.findName(), sex: _.sample(['man', 'femal', 'unknown']), desc: _.sample(['I am an cat!', 'To be an cat!', 'Funny cat']) });
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
    await Cat.updateMany({sex: 'man'}, { desc: _.sample(['I am an cat!', 'To be an cat!', 'Funny cat']) });
}

/**
 * mongoose find data
 */
async function findData() {
    const cats = await Cat.find({}); 
    const data = [
        ['index', '_id', 'name', 'sex', 'desc'],
    ];
    cats.forEach((item, i)=> {
        data.push([i+1, item.id, item.name, item.sex, item.desc])
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
 * mongodb show db info
 */
async function showDBInfo() {
    const db = await mongoose.connection.db;
    const collections = await db.collections();
    const tableDatas = [];
    for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        const collectionName = collection.collectionName;
        const stats = await db.command({collStats: collectionName});
        const size = (stats.storageSize/1024/1024).toFixed(2) + '/MB';
        const count = await collection.count({});
        tableDatas.push({ dbName: collection.dbName, collectionName, size, count })
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
        columnDefault: { width: 50 },
        columnCount: 5,
        columns: {
            0: { width: 15, alignment: 'left' },
            1: { width: 40, alignment: 'center'  },
            2: { width: 15, alignment: 'left'  },
            3: { width: 15, alignment: 'left'  },
            4: { width: 50, alignment: 'left'  },
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

async function main() {
    /*=====================mongoose start==============================*/
    await connect();

    /**
     * user/database manage
     */
    await showDBInfo();
    // await showUsers();


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