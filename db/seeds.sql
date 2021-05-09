USE tracker_db;

INSERT INTO department (name) VALUES
('Sales'),
('IT'),
('Finance'),
('HR');

INSERT INTO role (title, salary, department_id)
VALUES ('Data Analyst', 60000, 2),
        ('Salesperson', 50000, 1),
        ('Software Engineer', 120000, 2),
        ('Accountant', 95000, 3),
        ('Assistant', 46000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES('Harlen', 'McFarlane', 1, null),
('Stephanie', 'Delgado', 2, 1),
('Lacie', 'Snider', 2, 1),
('Benedict', 'Benson', 3, null),
('Grover', 'Alford', 4, 4),
('Devin', 'Barton', 4, 4),
('Patrick', 'Peralta', 5, null);

