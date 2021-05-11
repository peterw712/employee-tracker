const dotenv = require('dotenv');
const mysql = require("mysql2");
const inquirer = require("inquirer");

dotenv.config({ path: './.env'});

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.PASSWORD,
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
    connection.query("SELECT id FROM department", (err, res) => {
        if (err) throw err;
        const departmentIdArray = res.map(({ id }) => `${id}`)
    
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
            type: "input",
            message: "What is the department ID number?",
            validate: function (departmentInput) {
                var done = this.async();
                setTimeout(() => {
                  if (!departmentIdArray.includes(departmentInput.toString())) {
                    done(`${departmentInput} is not a valid department ID`);
                    return false;
                  }
                  done(null, true);
                }, 10);
              }
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
    });
};


function addEmployee() {
    // connection.query("SELECT id FROM role", (err, res) => {
    //     if (err) throw err;
    //     const roleIdArray = res.map(({ id }) => `${id}`)
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
            message: "What is the employee's role ID number?",
            // validate: function (roleInput) {
            //     var done = this.async();
            //     setTimeout(() => {
            //       if (!roleIdArray.includes(roleInput.toString())) {
            //         done(`${roleInput} is not a valid role ID`);
            //         return false;
            //       }
            //       done(null, true);
            //     }, 10);
            //   }
            // }
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

//connect to mysql database
connection.connect(err => {
    if (err) throw err;
    init();
});

function updateEmployeeRole() {
    connection.query("SELECT id, first_name, last_name FROM employee", (err, employeeRes) => {
        if (err) throw err;
        const formattedEmployeeData = employeeRes.map(({ id, first_name, last_name }) => `${id}: ${first_name} ${last_name}`)
        connection.query("SELECT id, title FROM role", (err, roleRes) => {
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





