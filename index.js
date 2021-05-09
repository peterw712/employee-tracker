const mysql = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
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
    init();
};

function department() {
    let query = "SELECT * FROM department"
    connection.query(query, (err, res) => {
        console.table(res)
    })
    init();
};

function role() {
    let query = "SELECT * FROM role"
    connection.query(query, (err, res) => {
        console.table(res)
    })
    init();
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
            }
        })
};

function add() {
    inquirer.prompt([
        {
            name: "employeeRoleDepartment",
            type: "list",
            message: "What would you like to add?",
            choices: ["Employee", "Role", "Department"]
        }])
        .then((response) => {
            switch (response.employeeRoleDepartment) {
                case "Employee":
                    addEmployee();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Department":
                    addDepartment();
                    break;
            }
        })
};

function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the employee's role ID number?"
        },
        {
            name: "manager_id",
            type: "input",
            message: "What is the manager's ID number?"
        },
        {
            name: "id",
            type: "number",
            message: "What is the employee's id?"
        },
    ])
        .then((response) => {
            console.table(response)
            let query = connection.query("INSERT INTO employee SET ?",
                {
                    first_name: response.first_name,
                    last_name: response.last_name,
                    role_id: response.role_id,
                    manager_id: response.manager_id,
                    id: response.id
                },
                (err, res) => {
                    if (err) throw err
                    console.log(res)
                })
            init();
        })
};

function addRole() {
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What is the role title?"
        },

        {
            name: "salary",
            type: "number",
            message: "What is the role salary?"
        },

        {
            name: "department_id",
            type: "number",
            message: "What is the department ID number?"
        }
    ])
        .then(function (response) {
            console.table(response)
            let query = connection.query("INSERT INTO role SET ?",
                {
                    title: response.title,
                    salary: response.salary,
                    department_id: response.department_id
                },
                function (err, res) {
                    if (err) throw err
                    console.log(res)
                })
            init();
        })
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "id",
            type: "number",
            message: "What is the department ID?"
        },

        {
            name: "name",
            type: "input",
            message: "What is the department name?"
        },
    ])

        .then(function (response) {
            console.table(response)
            let query = connection.query("INSERT INTO department SET ?",
                {
                    id: response.id,
                    name: response.name,

                },
                function (err, res) {
                    if (err) throw err
                    console.log(res)
                })
            init();
        })
};


//connect to mysql database
connection.connect(err => {
    if (err) throw err;
    init();
});

//start menu
function init() {
    inquirer.prompt([
        {
            name: "addViewUpdate",
            type: "list",
            message: "What would you like to do?",
            choices: ["View", "Add"]
        }])
        .then(function (response) {
            switch (response.addViewUpdate) {
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
            }
        })
};




