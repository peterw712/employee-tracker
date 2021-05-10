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
        init();
    })  
};

function department() {
    let query = "SELECT * FROM department"
    connection.query(query, (err, res) => {
        console.table(res)
        init();
    })  
};

function role() {
    let query = "SELECT * FROM role"
    connection.query(query, (err, res) => {
        console.table(res)
        init();
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
            }
        })
};

function add() {
    inquirer.prompt([
        {
            name: "departmentRoleEmployee",
            type: "list",
            message: "What would you like to add?",
            choices: ["Employee", "Role", "Department"]
        }])
        .then((response) => {
            switch (response.departmentRoleEmployee) {
                case "Department":
                    addDepartment();
                    break;
                case "Role":
                    addRole();
                    break;
                case "Employee":
                    addEmployee();
                    break;  
            }
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
            )
            console.log("Department added!")
            process.exit();
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
                
            )
            console.log("Role added!")
            process.exit();
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
                )
            console.log("Employee added!")
            process.exit();
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
            name: "viewAddUpdate",
            type: "list",
            message: "What would you like to do?",
            choices: ["View", "Add", "Update Employee Role"]
        }])
        .then(function (response) {
            switch (response.viewAddUpdate) {
                case "View":
                    view();
                    break;
                case "Add":
                    add();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
            }
        })
};

function updateEmployeeRole() {
    connection.query("SELECT id, first_name, last_name from employee", (err, employeeRes) => {
        if (err) throw err;
        const formattedEmployeeData = employeeRes.map(({ id, first_name, last_name }) => `${id}: ${first_name} ${last_name}`)
        connection.query("SELECT id, title from role", (err, roleRes) => {
            if (err) throw err;
            const formattedRoleData = roleRes.map(({ id, title }) => `${id}: ${title}`);
            inquirer.prompt([
                {
                    type: "list",
                    choices: formattedEmployeeData,
                    name: "targetEmp",
                    message: "Whose role needs to change?"
                }, {
                    type: "list",
                    choices: formattedRoleData,
                    name: "targetRole",
                    message: "What is their new role?"
                }
            ]).then(({ targetEmp, targetRole }) => {
                let id = targetEmp.split(":")[0]; 
                let role_ID = targetRole.split(":")[0];
                connection.query("UPDATE employee SET role_ID = ? WHERE id = ?", [role_ID, id], (err, success) => {
                    if (err) throw err;
                    console.log(`Employee role updated!`);
                    process.exit();
                })
            })

        })
    })
};




