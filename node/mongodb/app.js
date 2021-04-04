var mongoose = require('mongoose');
mongoose.connect('mongodb://test:test@localhost:27017/test', { useMongoClient: true });
mongoose.Promise = global.Promise;

var Cat = mongoose.model('Cat', { name: String , sex: String});

var kitty = new Cat({ name: 'Zildjian' , sex: 'man'});
kitty.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('meow');
    }
});
