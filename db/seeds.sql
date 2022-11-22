INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Jeff', 'Dery', 1, NULL),
    ('Erin', 'Guy', 2, 1),
    ('Action', 'Bronson', 3, NULL),
    ('Gary', 'Cool', 4, 3),
    ('Little', 'Dorrit', 5, NULL),
    ('Tiny', 'Yak', 6, 5),
    ('Laura', 'Newberry', 7, NULL),
    ('Garrett', 'Ohrt', 8, 7);