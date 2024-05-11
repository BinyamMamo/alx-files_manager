# Files Manager 🗃️ 

![](https://img.freepik.com/free-vector/data-center-technology_24908-59338.jpg?t=st=1715425384~exp=1715428984~hmac=e090745f5d270f22b9ad65329b36342e7ead5981b2b456234f4a99c20224f939&w=740)

## Project Overview
This project is a files manager built using back-end technologies such as JavaScript ES6, NoSQL MongoDB, Redis, NodeJS, and ExpressJS. The purpose of the project is to create a simple platform for uploading and viewing files, with features like user authentication, file listing, file uploading, changing file permissions, file viewing, and generating thumbnails for images.

## Requirements and Dependencies
- Node JS (version 12.x.x)
- Redis
- MongoDB
- Express

## Features
- User authentication via token
- File listing
- File upload
- Permission management
- File viewing
- Image thumbnail generation

## How to Use
To use the Files Manager application, follow these steps:

1. Install Node.js (version 12.x.x) if it is not already installed.
2. Install Redis and MongoDB on your system.
3. Clone the repository: 

```bash
git clone <repository-url>
```
4. Navigate to the project directory: 
```bash
cd alx-files_manager
```
5. Install the project dependencies: 
```bash
npm install
```
6. Set up the necessary environment variables, such as `DB_HOST`, `DB_PORT`, and `DB_DATABASE`.
7. Start the server: 
```bash
npm start
```
8. Access the application in your browser at `http://<DB_HOST>:<DB_PORT>`.

## Project Structure

```bash
.
├── package.json
├── .eslintrc.js
├── babel.config.js
├── utils/
│   ├── redis.js
│   └── db.js
├── server.js
├── routes/
│   └── index.js
└── controllers/
    └── AppController.js

```
Here are the important files used in this project:

| File | Description |
| --- | --- |
| [redis.js](utils/redis.js) | Contains the implementation of the RedisClient class for Redis connection and operations. |
| [db.js](utils/db.js) | Contains the implementation of the DBClient class for MongoDB connection and operations. |
| [server.js](server.js) | Creates the Express server and loads the routes. |
| [index.js](routes/index.js) | Defines the API endpoints for the application. |
| [AppController.js](controllers/AppController.js) | Contains the implementation of the API endpoints for getting the status and statistics. |
| [package.json](package.json) | Defines the project's dependencies and scripts. |
| [.eslintrc.js](.eslintrc.js) | Configures ESLint for code linting. |
| [babel.config.js](babel.config.js) | Configures Babel for transpiling JavaScript code. |

## 🎓 Key Takeaways
- Creating an API with Express.js
- User authentication and authorization
- Storing data in MongoDB
- Working with Redis for temporary data storage
- Setting up and using a background worker
- Handling file upload and permission management
- Generating image thumbnails

## Acknowledgements
This project was completed as part of the curriculum at **ALX SWE program**.

<pre align='center'>
_______ ______ ____  __       ___________       ____________
___    |___  / __  |/ /       __  ___/__ |     / /___  ____/
__  /| |__  /  __    /        _____ \ __ | /| / / __  __/   
_  ___ |_  /____    |         ____/ / __ |/ |/ /  _  /___   
/_/  |_|/_____//_/|_|         /____/  ____/|__/   /_____/   
                                                            
</pre>

