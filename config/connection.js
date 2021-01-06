// Set up MySQL connection.
const mysql = require('mysql');

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
  console.log(`Connected as id ${connection.threadId}`);
});

// Export connection for our ORM to use.
module.exports = connection;