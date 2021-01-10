// const orm = require('./config/orm');
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// Set up MySQL connection.
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  // NOTE: Be sure to add your MySQL password here!
  password: "Kmuraoka808!",
  database: "employees_db",
});

// Make connection
connection.connect((err) => {
  if (err) {
    console.error(`Error connectiong: ${err.stack}`);
    return;
  }
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update An Employee's Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Remove Department",
        "Exit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Update An Employee's Role":
          updateEmployeeRole();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Role":
          addRole();
          break;

        case "View All Departments":
          viewDepartments();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Remove Department":
          removeDept();
          break;
        case "Exit":
          connection.end();
          break;
      }
    });
};

// Function that validates the user's input is valid and is not blank
function validateInput(input) {
  if (input.trim() == "") {
    console.log("\x1b[31m", "Please answer the question to proceed.");
  } else {
    return true;
  }
}

function validateSalary(input) {
  if (input.trim() == "") {
    console.log("\x1b[31m", "Please answer the question to proceed.");
  } else if (isNaN(input)) {
    console.log(
      "\x1b[31m",
      "Input must be a numeric value, for example: 50000"
    );
  } else {
    return true;
  }
}

// Function that formats a user's input with title case and trimming blank spaces
function formatInput(str) {
  str = str.toLowerCase().trim().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// Function that formats a user's input with title case while typing
function titleCase(str) {
  str = str.toLowerCase().split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
}

// View all employees in the "employee" table
const viewEmployees = () => {
  const query =
    "SELECT emp.id AS ID, CONCAT(emp.first_name, ' ', emp.last_name) AS Name, r.title AS Title, d.name AS Department, CONCAT('$', FORMAT(r.salary, 2)) AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee emp INNER JOIN  role r ON emp.role_id=r.id INNER JOIN  department d ON r.department_id=d.id LEFT JOIN  employee m ON emp.manager_id = m.id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table("\x1b[35m", res);
    runSearch();
  });
};

// Add a employee to the "employee" table
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter the employee's first name:",
        validate: validateInput,
        transformer: titleCase,
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter the employee's last name:",
        validate: validateInput,
        transformer: titleCase,
      },
    ])
    .then((answers) => {
      connection.query(
        "SELECT id AS value, title AS name FROM role ORDER BY title ASC",
        (err, res) => {
          if (err) throw err;
          let array = JSON.parse(JSON.stringify(res));

          inquirer
            .prompt({
              name: "role",
              type: "list",
              message: "Choose a role for the new employee",
              choices: array,
            })
            .then((answer1) => {
              connection.query(
                "SELECT id AS value, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC",
                (err, res) => {
                  if (err) throw err;
                  let array2 = JSON.parse(JSON.stringify(res));

                  array2.unshift({ value: "No Manager", name: "No Manager" });

                  inquirer
                    .prompt({
                      name: "manager",
                      type: "list",
                      message: "Assign a manager for the new employee (if any)",
                      choices: array2,
                    })
                    .then((answer2) => {
                      // Format user's input before inserting into database
                      const newFirstName = formatInput(answers.firstName);
                      const newLastName = formatInput(answers.lastName);

                      if (answer2.manager == "No Manager") {
                        // add employee to the database
                        connection.query(
                          "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
                          [newFirstName, newLastName, answer1.role],
                          (err, res) => {
                            if (err) throw err;
                            if (res.affectedRows > 0) {
                              console.log(
                                "\x1b[32m",
                                res.affectedRows + " record added successfully!"
                              );
                              console.log(
                                "\x1b[32m",
                                "Your employee table has been updated\n"
                              );
                              console.log(
                                "\x1b[32m",
                                `${newFirstName} ${newLastName} has been added to the database.\n`
                              );
                            }
                            runSearch();
                          }
                        );
                      } else {
                        connection.query(
                          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                          [
                            newFirstName,
                            newLastName,
                            answer1.role,
                            answer2.manager,
                          ],
                          (err, res) => {
                            if (err) throw err;
                            if (res.affectedRows > 0) {
                              console.log(
                                "\x1b[32m",
                                res.affectedRows + " record added successfully!"
                              );
                              console.log(
                                "\x1b[32m",
                                "Your employee table has been updated\n"
                              );
                              console.log(
                                "\x1b[32m",
                                `${newFirstName} ${newLastName} has been added to the database.\n`
                              );
                            }
                            runSearch();
                          }
                        );
                      }
                    });
                }
              );
            });
        }
      );
    });
};

// Update an employees role
const updateEmployeeRole = () => {
  connection.query(
    "SELECT id as value, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC",
    (err, res) => {
      if (err) throw err;
      let array = JSON.parse(JSON.stringify(res));
      inquirer
        .prompt({
          name: "employee",
          type: "list",
          message: "Which employee's role do you want to change?",
          choices: array,
        })
        .then((answer1) => {
          connection.query(
            "SELECT id AS value, title AS name FROM role ORDER BY title ASC",
            (err, res) => {
              if (err) throw err;
              let array2 = JSON.parse(JSON.stringify(res));
              inquirer
                .prompt({
                  name: "role",
                  type: "list",
                  message:
                    "Select the new role that you'd like to set for this employee:",
                  choices: array2,
                })
                .then((answer2) => {
                  connection.query(
                    "UPDATE employee SET role_id = ? WHERE id = ?",
                    [answer2.role, answer1.employee],
                    (err, res) => {
                      if (err) {
                        if (err) {
                          console.log(
                            "\x1b[31m",
                            "Not allowed due to foreign key !"
                          );
                        } else {
                          console.log("\x1b[31m", "An error occured!");
                        }
                        return runSearch();
                      }
                      if (res.affectedRows > 0) {
                        console.log(
                          res.affectedRows + " record updated successfully!"
                        );
                      }
                      runSearch();
                    }
                  );
                });
            }
          );
        });
    }
  );
};

// View all roles in the "role" table
const viewRoles = () => {
  const query =
    "SELECT r.id AS ID, r.title AS Title, CONCAT('$', FORMAT(r.salary, 2)) AS Salary, d.name AS Department FROM role r INNER JOIN department d ON r.department_id=d.id ORDER BY ID";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table("\x1b[35m", res);
    runSearch();
  });
};

// Add a role to the "role" table
const addRole = () => {
  // empty array to dynamically populate current department names
  let array = [];
  // let deptChoices = [];
  // selects all rows in the "name" column, pushes name for each into the array in alphabetical order
  connection.query(
    "SELECT id AS value, name AS name FROM department ORDER BY name ASC",
    function (err, res) {
      if (err) throw err;
      array = JSON.parse(JSON.stringify(res));
      const questions = [
        {
          name: "title",
          type: "input",
          message: "Enter the title of this new role:",
          validate: validateInput,
          transformer: titleCase,
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary for this new role:",
          validate: validateSalary,
        },
        {
          name: "department",
          type: "list",
          message: "Select the department that this new roles belongs to:",
          choices: array,
        },
        {
          name: "confirm",
          type: "confirm",
          message: "Is the information you entered above correct?",
          default: true,
        },
      ];
      inquirer.prompt(questions).then((answers) => {
        if (answers.confirm == true) {
          // Format user's input before inserting into database
          const newTitle = formatInput(answers.title);
          const newSalary = formatInput(answers.salary);

          connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
            [newTitle, newSalary, answers.department],
            (err, res) => {
              if (err) throw err;
              if (res.affectedRows > 0) {
                console.log(
                  "\x1b[32m",
                  res.affectedRows + " record added successfully!"
                );
                console.log("\x1b[32m", "Your role table has been updated\n");
                console.log(
                  "\x1b[32m",
                  `The ${newTitle} role has been added to the database.\n`
                );
              }
              runSearch();
            }
          );
        } else {
          console.log("");
          runSearch();
        }
      });
    }
  );
};

// View all departments in the "department" table
const viewDepartments = () => {
  const query = "SELECT id AS ID, name AS Name FROM department ORDER BY ID;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table("\x1b[35m", res);
    runSearch();
  });
};

// Add a department to the "department" table
const addDepartment = () => {
  inquirer
    .prompt({
      name: "deptName",
      type: "input",
      message: "Enter the name of the department you'd like to add:",
      validate: validateInput,
      transformer: formatInput,
    })
    .then((answer) => {
      const query = "INSERT INTO department (name) VALUES (?)";
      // Format user's input before inserting into database
      const newDepartment = formatInput(answer.deptName);
      connection.query(query, [newDepartment], (err, res) => {
        if (err) throw err;
        console.log("\x1b[32m", "Your department table has been updated\n");
        console.log(
          "\x1b[32m",
          `The department with name: ${newDepartment}, has been added to the database.\n`
        );
        runSearch();
      });
    });
};

// Remove a selected department by it's name form the "department" table
const removeDept = () => {
  // empty array to dynamically populate current department names
  let deptObjArray = [];
  let deptChoices2 = [];
  // selects all rows in the "name" column, pushes name for each into the array in alphabetical order
  connection.query(
    "SELECT id, name FROM department ORDER BY name ASC",
    function (err, data) {
      if (err) throw err;
      for (i = 0; i < data.length; i++) {
        deptObj = { id: data[i].id, name: data[i].name };
        deptObjArray.push(deptObj);
        deptChoices2.push(data[i].name);
      }
    }
  );
  inquirer
    .prompt([
      {
        name: "deptName",
        type: "list",
        message: "Select the name of the department you'd like to remove:",
        choices: deptChoices2,
      },
      {
        name: "confirm",
        type: "confirm",
        message: "Are you sure you want to delete this department?",
        default: "yes",
      },
    ])
    .then((answers) => {
      const query = "DELETE FROM department WHERE name = ?";
      connection.query(query, [answers.deptName], (err, result) => {
        if (err) throw err;
        console.log("\x1b[32m", "Your department table has been updated\n");
        console.log(
          "\x1b[32m",
          `${answers.deptName} department has successfully been deleted from the database.\n`
        );

        // Show action prompts
        runSearch();
      });
    });
};

// You can loop over the array and test for that property:
function searchForId(arrayName, value) {
  for (let i = 0; i < arrayName.length; i++) {
    if (arrayName[i].name === value) {
      return arrayName[i].id;
    }
  }
}

// empty array to dynamically populate current department names
let deptObjArray = [];
let deptChoices2 = [];

const getDepartments = () => {
  connection.query(
    "SELECT id, name FROM department ORDER BY name ASC",
    function (err, data) {
      if (err) throw err;
      return data;
    }
  );
};
// var da = getDepartments;
// console.log(da);
// console.log(getDepartments());

function addArguments(queryString) {
  connection.query(queryString, function (err, results) {
    if (err) throw err;
    return results;
  });
}

// Function that fetches current role titles
function getRoleArrays() {
  // empty array to dynamically populate current role titles
  let roleObjArray = [];
  let titleChoices = [];
  // selects all rows in the "title" column, pushes title for each into the array in alphabetical order
  connection.query(
    "SELECT id, title FROM role ORDER BY title ASC",
    function (err, data) {
      if (err) throw err;
      for (i = 0; i < data.length; i++) {
        roleObj = { id: data[i].id, name: data[i].title };
        roleObjArray.push(roleObj);
        titleChoices.push(data[i].title);
      }
    }
  );
}
// Function that fetches the names of the current employees in the database
function getCurrentEmpArr(array) {
  connection.query(
    "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC",
    function (err, data) {
      if (err) throw err;
      for (i = 0; i < data.length; i++) {
        managerObj = { id: data[i].id, name: data[i].name };
        managerObjArray.push(managerObj);
        managerChoices.push(data[i].name);
      }
    }
  );
  let choices = girls.map((girl) => girl.age);
}

function getChoices(array) {
  let choices = array.map((element) => element.name);
  return choices;
}

// empty array to dynamically populate current role titles
let roleObjArray = [];
let titleChoices = [];
// selects all rows in the "title" column, pushes title for each into the array in alphabetical order
connection.query(
  "SELECT id, title FROM role ORDER BY title ASC",
  function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleObj = { id: data[i].id, name: data[i].title };
      roleObjArray.push(roleObj);
      titleChoices.push(data[i].title);
    }
  }
);

// function selectWhere(table, colToSearch, valOfCol) {
//   let tableStr = table.toString();
//   let colToSearchStr = colToSearch.toString();
//   let valOfColStr = valOfCol.toString();
//   const queryString = "SELECT id FROM ?? WHERE ?? = ?";
//   connection.query(
//     queryString,
//     [tableStr, colToSearchStr, valOfColStr],
//     (err, result) => {
//       if (err) throw err;
//       console.log(result.id);
//     }
//   );
// }
