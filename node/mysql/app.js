const mysql = require('mysql');
const mysql_url = require('../config').mysql.url;
var connection = mysql.createConnection(mysql_url);

connection.connect();

// connection.query('SELECT * from a', function(err, rows, fields) {
//     if (err) throw err;
//     console.log('The solution is: ', rows[0]);
// });

connection.end();
