/*

To run this file, do the folling in your terminal:

1. Go to the directory of this sql file.

2. Get into our mysql console, I do this by running "mysql -u root -p"

3. Run "source schema.sql"

*/

-- Drops the "employees_db" if it already exists --
DROP DATABASE IF EXISTS employees_db;

-- Create the database "employees_db" and specify it for use
CREATE DATABASE employees_db;

USE employees_db;

-- Create the table "department"
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

-- Create the table "role"
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(department_id) REFERENCES department(id)
);

-- Create the table "employee"
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
