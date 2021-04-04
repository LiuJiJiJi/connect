var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'test',
    password : 'test',
    database : 'test'
});

connection.connect();

connection.query('SELECT * from a', function(err, rows, fields) {
    if (err) throw err;
    console.log('The solution is: ', rows[0]);
});

connection.end();
