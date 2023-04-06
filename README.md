# NC News API

## 📝 Description

NC News API is a RESTful API built using Javascript, Node.js, PostgreSQL and Express.js. It has been designed to provide the functionality behind and interactive web application, which will serve as a Reddit-style news aggregation and comments board. 

## End Points

* `GET` users can access all topics, articles and comments.
* `POST` users can post a comment on article.
* `DELETE` users can delete their own comments.
* `PATCH` users can up-vote or down-vote on an article.

## ⌨️ Getting Started

In order to run this project locally, the following must be installed on your machine:

* Node.js v19.6.1 - Node Package Manager (npm)
* PostgreSQL v12.12 
* git (and a Github account)

1. Fork this repository.
2. Via your terminal, navigate to your desired directory or create a new directory using `mkdir <project-name>`. 
3. Clone your forked version of the repository to your local machine using the command `git clone <repo-url>`.
3. Naviagte into your new directory using `cd <project-name>` and open it with your chosen software, e.g. using the command `code .` to open it in VSCode.
4. In your terminal, run `npm install` to install the required dependencies.

## 💻 Run Locally

1. You will need to create 2 .env files in the main directory, with the following names and contents to connect the databases:

* .env.development - this file should contain PGDATABASE=nc_news
* .env.test - this file should containe PGDATABASE=nc_news_test

2. Run the following commands in your terminal to seed the local database:

* `npm run setup-dbs`
* `npm run seed`

3. Start the server using `npm start`. You can make requests using your browser or install an application such as Insomnia.

4. Run the tests using the command `npm test`.

Happy hacking!
