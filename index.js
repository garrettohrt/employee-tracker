const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_db',
    password: ''
});

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
        "SELECT * FROM department;",
        (err, results) => {
            console.table(results);
            promptMenu();
        });
};

const selectRoles = () => {
    connection.query(
        "SELECT * FROM role;",
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

const promptAddRole = () => {
    return connection.promise().query(
        "SELECT department.id, department.name FROM department;")
        .then(([departments]) => {
            let departmentChoices = departments.map(({
                id,
                name
            }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt([{
                type: 'input',
                name: 'title',
                message: 'Enter the name of the role you would like to add'
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department are you from?',
                choices: departmentChoices
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter your salary'
            }

            ])
                .then(({ title, department, salary }) => {
                    const query = connection.query(
                        "INSERT INTO role SET ?",
                        {
                            title: title,
                            department_id: department,
                            salary: salary
                        },
                        function (err, res) {
                            if (err) throw err;
                        }
                    )
                }).then(() => selectRoles())
        })
};

const promptAddEmployee = () => {
    return connection.promise().query("SELECT R.id, R.title FROM role R;")
        .then(([employees]) => {
            let titleChoices = employees.map(({
                id,
                title

            }) => ({
                value: id,
                name: title
            }))

            connection.promise().query("SELECT E.id, CONCAT(E.first_name,' ',E.last_name) AS manager FROM employee E;")
                .then(([managers]) => {
                    let managerChoices = managers.map(({
                        id,
                        manager
                    }) => ({
                        value: id,
                        name: manager
                    }));

                    inquirer.prompt(
                        [{
                            type: 'input',
                            name: 'firstName',
                            message: 'What is the employees first name?',
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: 'What is the employees last name?',
                        },
                        {
                            type: 'list',
                            name: 'role',
                            message: 'What is the employees role?',
                            choices: titleChoices
                        },
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who is the employees manager?',
                            choices: managerChoices
                        }

                        ])
                        .then(({ firstName, lastName, role, manager }) => {
                            const query = connection.query(
                                "INSERT INTO employee SET?",
                                {
                                    first_name: firstName,
                                    last_name: lastName,
                                    role_id: role,
                                    manager_id: manager
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log({ firstName, lastName, role, manager })
                                }
                            )
                        })
                        .then(() => selectEmployees())
                })
        })
};

const promptUpdateRole = () => {
    
    return connection.promise().query("SELECT R.id, R.title, R.salary, R.department_id FROM role R;")
       .then(([roles]) => {
            let roleChoices = roles.map(({

            }))
})
}

promptMenu();