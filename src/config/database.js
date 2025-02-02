const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'trashycle'
});

connection.connect((err) => {
    if(!!err){
        console.log(err);
    }else{
        console.log('Koneksi ke MySQL berhasil');
    }
})

module.exports = connection;
