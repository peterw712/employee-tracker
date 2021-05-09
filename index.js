let mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "68yarecirPotS04",
    database: "tracker_db"
});

function employee() {
    let query = "SELECT * FROM employee"
    connection.query(query, (err, res) => {
        console.table(res)
    })
};

function department() {
    let query = "SELECT * FROM department"
    connection.query(query, (err, res) => {
        console.table(res)
    })
};

function role() {
    let query = "SELECT * FROM role"
    connection.query(query, (err, res) => {
        console.table(res)
    })
};

console.log(employee());
console.log(department());
console.log(role());



