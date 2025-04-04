# LocalVibe Hub

LocalVibe Hub is a full-stack web application developed as a qualification project at the University of Latvia.  
It allows users to discover and host local events, register, communicate, and manage their profiles, while administrators moderate content and handle reports.

##  Repository

GitHub: [https://github.com/Schizzzx/LocalVibeHub](https://github.com/Schizzzx/LocalVibeHub)

<!-- ________________________________________________________________________________________________________ -->

##  Technologies Used

- **Frontend**: React, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Email**: SMTP (MailerSend)
- **Authentication**: JWT
- **Deployment**: Local (for demo)

<!-- ________________________________________________________________________________________________________ -->

##  Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/Schizzzx/LocalVibeHub.git
cd LocalVibeHub
# ________________________________________________________________________________________________________

2. Configure MySQL database

    Create a database named: localvibe

    Use the provided SQL script to initialize all tables:

# In MySQL Workbench or terminal
Run the script: localvibe_schema.sql
# ________________________________________________________________________________________________________
3. Configure environment variables

Create a .env file in the /backend folder:

PORT=5000                           
#  change it if you using mac os (for example 5050). 
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=localvibe

# if you use google, outlook, yandex...
# but it didn't work for me
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# therefore I used smtp.mailersend.net
# so, I needed to also add
# It is free (only 1000 email-letters)

EMAIL_USER=. . .         
EMAIL_PASS=. . .                 
EMAIL_HOST=smtp.mailersend.net                                  
EMAIL_PORT=. . .                                                  
EMAIL_SECURE=false  

# it is not so important, It allows the web application to send you notifications via email

Make sure your MySQL credentials and email SMTP credentials are correct.
# ________________________________________________________________________________________________________
4. Install dependencies
Backend:

cd backend
npm install

Frontend:

cd ../frontend
npm install
# ________________________________________________________________________________________________________
5. Start the application
Backend:

cd backend
npm run dev

Runs on: http://localhost:5000/
Frontend:

cd ../frontend
npm run dev

Runs on: http://localhost:5173/
 Default Application Structure

    Registration → /register

    Login → /login

    Profile setup → /setup

    Main page → /main

    Admin panel → /admin (only for users with role = 1)

    Event creation → /create

    Favorites → /favorites

    Support → /support

    Calendar → /calendar

    Chat → /chat

# ________________________________________________________________________________________________________
 Reviewer Notes

    All data is stored in the local MySQL database.

    Admin role can be assigned manually in the database (users.role = 1)

    # to create your own admin users, create him(or her). on the website - it is the easiest way. get his ID (open your profile, in the search bar there will be numbers. copy them), then enter this into the mysql terminal 
    # mysql -u root -p
    # "enter your password"

    # USE localvibe;
    # UPDATE users
    # SET role = 1
    # WHERE id = 4;
    
    # "change 4 for the id of your user"

    Notifications are sent both in-app and via email (requires working SMTP credentials).

    The project supports full functionality for user interaction, chat, event management, moderation, and more.
# ________________________________________________________________________________________________________
Author

This project was developed by Grigory Ivashkin, a student at the University of Latvia as part of a qualification project.