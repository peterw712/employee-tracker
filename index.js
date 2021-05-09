let mysql = require("mysql2");
let inquirer = require("inquirer");

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

function view() {
    inquirer.prompt([
        {
            name: "choiceView",
            type: "list",
            message: "What would you like to view?",
            choices: ["All Departments", "All Roles", "All Employees"]
        }]).then(function (response) {
            switch (response.choiceView) {

                case "All Departments":
                    department();
                    break;
                case "All Roles":
                    role();
                    break;
                case "All Employees":
                    employee();
                    break;
                default: console.log("Please enter appropriate choice.")

            }
        })
};

console.log(view());




