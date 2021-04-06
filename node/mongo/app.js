const table = require('table').table;
const _ = require('lodash');
const mongoose = require('mongoose');
const Cat = mongoose.model('Cat', { name: String , sex: String, desc: String});

/**
 * connect
 */
async function connect() {

    /**
     * suport mongoose@4
     */
    // mongoose.Promise = global.Promise;
    return mongoose.connect(require('../config').mongo.url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}


/**
 * insert data
 */
async function saveData() {
    const desc = _.sample(['I am an cat!', 'To be an cat!', 'Funny cat'])
    const kitty = new Cat({ name: 'Zildjian' , sex: 'man', desc });
    return new Promise((resolve, reject) => {
        kitty.save(function (err, doc) {
            if (err) return reject(err);
            console.log('[mongo save data result success]:', doc);
            return resolve(doc);
        });
    })
}

/**
 * update data
 */
 async function updateData() {
    await Cat.updateMany({sex: 'man'}, { desc: _.sample(['I am an cat!', 'To be an cat!', 'Funny cat']) });
}

/**
 * find data
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
 * remove data
 */
async function removeData() {
    await Cat.remove({}); 
}


async function main() {
    await connect();
    
    await saveData();
    // await updateData();
    // await removeData();
    await findData();

    await mongoose.connection.close()
}

// run
main();