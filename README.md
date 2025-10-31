## Simple Authentication System

- A simple and secure authentication system built with Node.js, Express, MongoDB, and JWT that includes user registration, login, logout, email verification, and password reset functionality.

## Features

-  User Registration (Sign Up) – Create a new account with email and password

-  Login (Sign In) – Authenticate users and return a secure token (JWT or session)

-  Logout – Invalidate the current session or token

-  Email Verification – Send verification link to confirm the user’s email

-  Password Reset – Reset forgotten passwords through email link

-  Secure Password Hashing – Passwords are stored securely using bcrypt (or other algorithm)

-  Validation & Error Handling – Proper input validation and meaningful error messages

## Tech Stack

   ## Frontend
   -  React.js
   -  Axios
   ## Backend
   -  Node.js
   -  Express.js
   -  MongoDB
   ## Email Service
   -  NodeMailer
   ## Password Encryption
   -  Bcrypt

## ⚙️ Installation & Setup

- Clone the repository

- git clone https://github.com/your-username/simple-auth.git
- cd simple-auth

## Install dependencies
 - Run the following command to install all required packages:

 - npm install


## Create an environment file
 In the project root, create a .env file and add the following variables:

 PORT=5000  

 MONGO_URI=your_mongodb_connection_string  

 JWT_SECRET=your_jwt_secret_key  

 SMTP_USER=your_email@example.com  

 SMTP_PASS=your_email_password  

 BACKEND_URL=http://localhost:3000  

 SENDER_EMAIL=your_email  


## Start the application
 - Use the command below to run the server:

 - npm start


## Access the project
 - Once started, the app will be available at:

 - http://localhost:5000
