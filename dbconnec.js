const mysql=require('mysql')
const mysqlConnection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'poonamwatersuppliers',
    multipleStatements: true,
    port: 3306
});

// mysqlConnection.connect((err) => {
//     if (!err)
//         console.log('Connection Established Successfully');
//     else
//         console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
// });

module.exports= mysqlConnection