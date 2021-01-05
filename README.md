# Employee Content Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

This command-line application helps a business owner/manager to view and manage the departments, roles, and employees in their company so that they can easily and more efficiently, organize and plan their business. Specifically, users are able to:

1. Add departments, roles, employees
2. View departments, roles, employees
3. Update employee roles

#### Concepts Used

Developers are often tasked with creating interfaces that make it easy for non-developers to view and interact with information stored in databases. Often these interfaces are known as Content Management Systems. Thus, to exercise these concepts, I built a command-line application using node, inquirer, and MySQL that functions as a solution for managing a company's employees.

I designed the following database schema containing three tables. See the [schema.sql](db/schema.sql) file in the db folder to see how the database was created.

![MySQL database schema diagram](Assets/schema.png)

#### 

## Table of Contents

* [**Installation**](#installation)
* [**Usage**](#usage)
* [**License**](#license)
* [**Contributing**](#contributing)
* [**Questions**](#questions)

## Installation

This command-line application uses [**Node.js**](https://nodejs.org/en/download/), which is a JavaScript run-time environment which includes everything you need to execute a program written in JavaScript. If haven't downloaded the [**Node.js**](https://nodejs.org/en/download/) source code or a pre-built installer for your platform, you will need to do so using this [**link**](https://nodejs.org/en/download/).

The dependencies required for this project are:

* The [**MySQL**](https://www.npmjs.com/package/mysql) NPM package to connect to your MySQL database and perform queries.

* The [**InquirerJs**](https://www.npmjs.com/package/inquirer) NPM package to interact with the user via the command-line.

* [**console.table**](https://www.npmjs.com/package/console.table) to print MySQL rows to the console. There is a built-in version of console.table, but the NPM package formats the data a little better for our purposes.

To initialize your project and install these required dependencies, open a command prompt at the project's directory and run:

``` 

npm init -y  // initialize the project with NPM
npm i mysql
npm i inquirer
npm i console.table
```

## Usage

To use this app, run the index.js file in the project folder. A series of prompts will be generated, answer each question and press enter.

## License

This project is licensed under the [**MIT**](https://opensource.org/licenses/MIT) license.

## Contributing

All comments and suggestions regarding improvements to this project are welcome. To contribute to this project, clone this [**project repository**](https://github.com/kaylamuraoka/Employee_Content_Management_System) locally and commit your code on a separate branch. You may then modify the code to your liking, submit well-formed pull requests and open useful issues. For steps on how to clone a repository using the command line, read this section of the Github Docs [**about cloning a repository**](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository#about-cloning-a-repository).

## Questions

Please use the contact information below if you would like to reach me with any questions.

* Github Profile: [**@kaylamuraoka**](https://github.com/kaylamuraoka)

* Email: [**kmurs98@gmail.com**]
