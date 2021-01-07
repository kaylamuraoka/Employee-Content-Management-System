// const orm = require('./config/orm');
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

// Set up MySQL connection.
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  // NOTE: Be sure to add your MySQL password here!
  password: '',
  database: 'employees_db',
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
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Employees',
      'Add Employee',
      "Update An Employee's Role",
      'View All Roles',
      'Add Role',
      'View All Departments',
      'Add Department',
    ],
  })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          viewAllEmp();
          break;
        
        case 'Add Employee':
          addEmp();
          break;
        
        case "Update An Employee's Role":
          updateEmpRole();
          break;
        
        case 'View All Roles':
          viewAllRoles();
          break;
        
        case 'Add Role':
          addRole();
          break;
        
        case 'View All Departments':
          viewAllDept();
          break;
        
        case 'Add Department':
          addDept();
          break;
    }
  })
}

// Function that validates the user's input is valid and is not blank
function validateInput(input) {
  if (input.trim() == "") {
    console.log("\x1b[31m", "Please answer the question to proceed.");
  } else {
    return true;
  };
};

// Function that formats a user's input with title case and trimming blank spaces
function formatInput(str) {
  str = str.toLowerCase().trim().split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

// Function that formats a user's input with title case while typing
function titleCase(str) {
  str = str.toLowerCase().split(' ');
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }
  return str.join(' ');
}

// View all employees in the "employee" table
const viewAllEmp = () => {
  const query = "SELECT emp.id AS ID, CONCAT(emp.first_name, ' ', emp.last_name) AS Name, r.title AS Title, d.name AS Department, CONCAT('$', FORMAT(r.salary, 2)) AS Salary, CONCAT(m.first_name, ' ', m.last_name) AS Manager FROM employee emp LEFT JOIN  role r ON emp.role_id=r.id LEFT JOIN  department d ON r.department_id=d.id LEFT JOIN  employee m ON emp.manager_id = m.id";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.table("\x1b[35m", result);
    runSearch();
  });
};

// Add a employee to the "employee" table
const addEmp = () => {
  // empty array to dynamically populate current role titles
  let roleObjArray = [];
  let titleChoices = [];
  // selects all rows in the "title" column, pushes title for each into the array in alphabetical order
  connection.query("SELECT id, title FROM role ORDER BY title ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleObj = { id: data[i].id, name: data[i].title };
      roleObjArray.push(roleObj);
      titleChoices.push(data[i].title);
    }
  });

  // empty array to dynamically populate current employee's names
  let managerObjArray = ['No Manager'];
  let managerChoices = ['No Manager'];
  
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      managerObj = { id: data[i].id, name: data[i].name };
      managerObjArray.push(managerObj);
      managerChoices.push(data[i].name);
    }
  })
  inquirer.prompt([
    {
      name: "firstName",
      type: 'input',
      message: "Enter the employee's first name:",
      validate: validateInput,
      transformer: titleCase,
    },
    {
      name: "lastName",
      type: 'input',
      message: "Enter the employee's last name:",
      validate: validateInput,
      transformer: titleCase,
    },
    {
      name: "roleTitle",
      type: 'list',
      message: "Select the employee's role:",
      choices: titleChoices,
    },
    {
      name: "managerName",
      type: 'list',
      message: "Select the employee's manager (if any):",
      choices: managerChoices,
    }
  ])
  .then((answers) => {
    // Format user's input before inserting into database
    const newFirstName = formatInput(answers.firstName);
    const newLastName = formatInput(answers.lastName);
    
    // Get the role ID that corresponds to the selected role title
    const newRoleId = searchForId(roleObjArray, answers.roleTitle);
    
    if (answers.managerName === "No Manager") {
      // No manager is selected
      const query = 'INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)';
      
      // Add new employee to the database
      connection.query(query, [newFirstName, newLastName, newRoleId], (err, result) => {
        if (err) throw err;
        console.log("\x1b[32m", "Your employee table has been updated\n");
        console.log("\x1b[32m", `${newFirstName} ${newLastName} has been added to the database.\n`);

        // Show action prompts
        runSearch()
      });
    } else {
      // Manager is selected
      let newManagerId = searchForId(managerObjArray, answers.managerName);
      const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';

      // Add new employee to the database
      connection.query(query, [newFirstName, newLastName, newRoleId, newManagerId], (err, result) => {
        if (err) throw err;
        console.log("\x1b[32m", "Your employee table has been updated\n");
        console.log("\x1b[32m", `${newFirstName} ${newLastName} has been added to the database.\n`);

        // Show action prompts
        runSearch()
      });
    };
  });
};

// Update an employees role
const updateEmpRole = () => {
  // empty array to dynamically populate current employee's names
  let empObjArray = [];
  let empChoices = [];
  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      empObj = { id: data[i].id, name: data[i].name };
      empObjArray.push(empObj);
      empChoices.push(data[i].name);
    };
  });
  
  // empty array to dynamically populate current role titles
  let roleObjArray = [];
  let titleChoices = [];
  // selects all rows in the "title" column, pushes title for each into the array in alphabetical order
  connection.query("SELECT id, title FROM role ORDER BY title ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleObj = { id: data[i].id, name: data[i].title };
      roleObjArray.push(roleObj);
      titleChoices.push(data[i].title);
    };
  })
  inquirer.prompt([
    {
      name: "selectedEmp",
      type: 'list',
      message: "Select the employee, who's role you'd like to update:",
      choices: empChoices,
    },
    {
      name: "selectedRole",
      type: "list",
      message: "Select the role that you'd like to set for this employee:",
      choices: titleChoices,
    },
  ])
  .then((answers) => {
    // Get the role ID that corresponds to the selected role title
    let selectedEmpId = searchForId(empObjArray, answers.selectedEmp);
    let selectedRoleId = searchForId(roleObjArray, answers.selectedRole);

    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';

    // Add new employee to the database
    connection.query(query, [selectedRoleId, selectedEmpId], (err, result) => {
      if (err) throw err;
      console.log("\x1b[32m", `${answers.selectedEmp}'s role has been updated to ${answers.selectedRole}.\n`);

      // Show action prompts
      runSearch()
    });
  });
};

// View all roles in the "role" table
const viewAllRoles = () => {
  const query = "SELECT r.id AS ID, r.title AS Title, CONCAT('$', FORMAT(r.salary, 2)) AS Salary, d.name AS Department FROM role r LEFT JOIN department d ON r.department_id=d.id;";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.table("\x1b[35m", result);
    runSearch();
  });
};

// Add a role to the "role" table
const addRole = () => {
  // empty array to dynamically populate current department names
  let deptObjArray = [];
  let deptChoices = [];
  // selects all rows in the "name" column, pushes name for each into the array in alphabetical order
  connection.query("SELECT id, name FROM department ORDER BY name ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      deptObj = { id: data[i].id, name: data[i].name };
      deptObjArray.push(deptObj);
      deptChoices.push(data[i].name);
    }
  })
  inquirer.prompt([
    {
      name: "title",
      type: 'input',
      message: "Enter the role's title:",
      validate: validateInput,
      transformer: titleCase,
    },
    {
      name: "salary",
      type: 'input',
      message: "Enter the role's salary:",
      validate: validateInput,
      transformer: titleCase,
    },
    {
      name: "deptName",
      type: 'list',
      message: "Select the roles's department:",
      choices: deptChoices,
    },
  ])
  .then((answers) => {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    // Format user's input before inserting into database
    const newTitle = formatInput(answers.title);
    const newSalary = formatInput(answers.salary);

    // Get the department ID that corresponds to the selected department name
    const newDeptId = searchForId(deptObjArray, answers.deptName);

    connection.query(query, [newTitle, newSalary, newDeptId], (err, result) => {
      if (err) throw err;
      console.log("\x1b[32m", "Your role table has been updated\n");
      console.log("\x1b[32m", `The ${newTitle} role has been added to the database.\n`);

      // Show action prompts
      runSearch()
    });
  });
};

// View all departments in the "department" table
const viewAllDept = () => {
  const query = "SELECT id AS ID, name AS Name FROM department;";
  connection.query(query, (err, result) => {
    if (err) throw err;
    console.table("\x1b[35m", result);
    runSearch();
  });
};

// Add a department to the "department" table
const addDept = () => {
  inquirer.prompt({
    name: "deptName",
    type: 'input',
    message: "Enter the name of the department:",
    validate: validateInput,
    transformer: formatInput,
  })
  .then((answer) => {
    const query = 'INSERT INTO department (name) VALUES (?)';
    // Format user's input before inserting int database
    const newDept = formatInput(answer.deptName);
    connection.query(query, [answer.deptName], (err, result) => {
      if (err) throw err;
      console.log("\x1b[32m", "Your department table has been updated\n");
      console.log("\x1b[32m", `${newDept} has been added to the database.\n`);

      // Show action prompts
      runSearch()
    });
  });
};

// You can loop over the array and test for that property:
function searchForId(arrayName, value){
  for (let i = 0; i < arrayName.length; i++) {
    if (arrayName[i].name === value) {
        return arrayName[i].id;
    }
  }
}

// Function that fetches current role titles
function getRoleArrays() {
  // empty array to dynamically populate current role titles
  let roleObjArray = [];
  let titleChoices = [];
  // selects all rows in the "title" column, pushes title for each into the array in alphabetical order
  connection.query("SELECT id, title FROM role ORDER BY title ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleObj = { id: data[i].id, name: data[i].title };
      roleObjArray.push(roleObj);
      titleChoices.push(data[i].title);
    }
  });
};  
// Function that fetches the names of the current employees in the database
function getCurrentEmpArr(array) {

  connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY name ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      managerObj = { id: data[i].id, name: data[i].name };
      managerObjArray.push(managerObj);
      managerChoices.push(data[i].name);
    }
  })
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
  connection.query("SELECT id, title FROM role ORDER BY title ASC", function (err, data) {
    if (err) throw err;
    for (i = 0; i < data.length; i++) {
      roleObj = { id: data[i].id, name: data[i].title };
      roleObjArray.push(roleObj);
      titleChoices.push(data[i].title);
    }
  });

function selectWhere(table, colToSearch, valOfCol) {
  let tableStr = table.toString();
  let colToSearchStr = colToSearch.toString();
  let valOfColStr = valOfCol.toString();
  const queryString = 'SELECT id FROM ?? WHERE ?? = ?';
  connection.query(queryString, [tableStr, colToSearchStr, valOfColStr], (err, result) => {
    if (err) throw err;
    console.log(result.id);
  });
};
