/*

To run this file, do the folling in your terminal:

1. Go to the directory of this sql file.

2. Get into our mysql console, I do this by running "mysql -u root -p"

3. Run "source schema.sql"

*/

-- specify employees_db for use
USE employees_db;

-- Insert a set of records into the "department" table.
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Information Technology');
INSERT INTO department (name) VALUES ('Sales');

-- Insert a set of records into the "role" table.
INSERT INTO role (title, salary, department_id) VALUES ('Director of Marketing', '99913', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Manager', '80295', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Content Strategist', '65732', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Associate', '53851', '1');
INSERT INTO role (title, salary, department_id) VALUES ('Social Media Specialist', '50848', '1');

INSERT INTO role (title, salary, department_id) VALUES ('Chief Financial Officer', '127729', '2');
INSERT INTO role (title, salary, department_id) VALUES ('Financial Analyst', '69419', '2');
INSERT INTO role (title, salary, department_id) VALUES ('Financial Advisor', '66931', '2');

INSERT INTO role (title, salary, department_id) VALUES ('Director of IT', '114839', '3');
INSERT INTO role (title, salary, department_id) VALUES ('Information Security Manager', '109348', '3');
INSERT INTO role (title, salary, department_id) VALUES ('IT Project Manager', '85808', '3');
INSERT INTO role (title, salary, department_id) VALUES ('Information Systems Manager', '82065', '3');
INSERT INTO role (title, salary, department_id) VALUES ('IT Administrator', '56513', '3');

INSERT INTO role (title, salary, department_id) VALUES ('Director of Sales', '100657', '4');
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', '74675', '4');
INSERT INTO role (title, salary, department_id) VALUES ('Sales Consultant', '67841', '4');
INSERT INTO role (title, salary, department_id) VALUES ('Sales Representative', '59842', '4');

-- Insert a set of records into the "employee" table.
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Douglas', 'Spears', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Olive', 'Preece', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Janice' ,'Kelly', 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Beth', 'Brown', 3, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Emilio', 'Mckenzie', 4, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Anthony', 'Ortega', 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Oliver', 'Wilson', 5, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sheryl', 'Reese', 6, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Cassandra', 'Hanson', 7, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ryan', 'Flores', 8, 8);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jessie', 'Holt', 8, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jackie', 'Bates', 9, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Wanda', 'Poole', 10, 12);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Julius', 'Buchanan', 11, 13);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Yvette', 'Clarke', 11, 13);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jermaine', 'Barker', 12, 13);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Lillie', 'Black', 13, 16);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Fernando', 'Dunn', 14, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Lewis', 'Simpson', 15, 18);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Sidney', 'Carroll', 15, 18);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alisher', 'Rosa', 16, 19);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Noah', 'Maia', 17, 20);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mariana', 'Coleen', 17, 20);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Steven', 'Knight', 17, 20);
