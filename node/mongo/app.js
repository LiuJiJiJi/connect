const mongoose = require('mongoose');
mongoose.connect(require('../config').mongo.url);
mongoose.Promise = global.Promise;

const Cat = mongoose.model('Cat', { name: String , sex: String});

const kitty = new Cat({ name: 'Zildjian' , sex: 'man'});
kitty.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('meow');
    }
});
