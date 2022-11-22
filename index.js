const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
    password: ''
})

const promptMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']
        }
    ])
        .then(userChoice => {
            switch (userChoice.menu) {
                case 'view all departments':
                    selectDepartments();
                    break;
                case 'view all roles':
                    selectRoles();
                    break;
                case 'view all employees':
                    selectEmployees();
                    break;
                case 'add a department':
                    promptAddDepartment();
                    break;
                case 'add a role':
                    promptAddRole();
                    break;
                case 'add an employee':
                    promptAddEmployee();
                    break;
                case 'update an employee role':
                    promptUpdateEmployeeRole();
                    break;
                default:
                    process.exit();
            }
        });
};

const selectDepartments = () => {
    connection.query(
        'SELECT * FROM department;',
        (err, results) => {
            console.table(results);
            promptMenu();
        });
};

const selectRoles = () => {
    connection.query(
        'SELECT * FROM role;',
        (err, results) => {
            console.table(results);
            promptMenu();
        });
};


const selectEmployees = () => {
    connection.query(
        "SELECT E.id, E.first_name, E.last_name, R.title, D.name AS department, R.salary, CONCAT(M.first_name,' ',M.last_name) AS manager FROM employee E JOIN role R ON E.role_id = R.id JOIN department D ON R.department_id = D.id LEFT JOIN employee M ON E.manager_id = M.id;",
        (err, results) => {
            console.table(results);
            promptMenu();
        }
    );
};

const promptAddDepartment = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'Name the department you would like to add?',
    }
    ])
        .then(name => {
            connection.promise().query("INSERT INTO department SET ?", name);
            selectDepartments();
        })
};

const promptAddRole = () => {}

const promptAddEmployee = () => {}

const promptUpdateRole = () => {}

promptMenu();