# LocalVibe Hub

LocalVibe Hub is a full-stack web application developed as a qualification project at the University of Latvia.  
It allows users to discover and host local events, register, communicate, and manage their profiles, while administrators moderate content and handle reports.

---

##  Repository

GitHub: [https://github.com/Schizzzx/LocalVibeHub](https://github.com/Schizzzx/LocalVibeHub)

---

##  Technologies Used

- **Frontend**: React, Tailwind CSS, Vite  
- **Backend**: Node.js, Express  
- **Database**: MySQL  
- **Authentication**: JWT  
- **Email Service**: MailerSend (SMTP)  
- **Deployment**: Local (manual)

---

##  Installation Guide

### 1. Clone the repository

```bash
git clone https://github.com/Schizzzx/LocalVibeHub.git
cd LocalVibeHub
```

---

### 2. Set up MySQL database

- Create a database named `localvibe`
- Use the provided SQL script to create all necessary tables:

```sql
-- In MySQL terminal or Workbench:
USE localvibe;
SOURCE localvibe_schema.sql;
```

---

### 3. Configure environment variables

Create a `.env` file inside the `/backend` directory:

```ini
PORT=5000
# use another for MacOS
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=localvibe

# Email (recommended: MailerSend SMTP)
EMAIL_USER=your_mailersend_address
EMAIL_PASS=your_mailersend_password
EMAIL_HOST=smtp.mailersend.net
EMAIL_PORT=587
EMAIL_SECURE=false
```

> You may also use Gmail/Outlook/Yandex, but SMTP configuration is recommended and tested with MailerSend. Free tier supports 1000 emails/month.

---

### 4. Install dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

---

### 5. Start the application

#### Backend:
```bash
cd backend
npm run dev
```
Runs on: `http://localhost:5000/`

#### Frontend:
```bash
cd ../frontend
npm run dev
```
Runs on: `http://localhost:5173/`

---

## 🧭 Application Structure

| Feature         | Route                     |
|-----------------|---------------------------|
| Registration    | `/register`               |
| Login           | `/login`                  |
| Profile Setup   | `/setup`                  |
| Main Page       | `/main`                   |
| Admin Panel     | `/admin` *(role = 1)*     |
| Event Creation  | `/create`                 |
| Favorites       | `/favorites`              |
| Support Page    | `/support`                |
| Calendar        | `/calendar`               |
| Chat            | `/chat`                   |

---

##  Reviewer Instructions

- All user and event data is stored in MySQL under the `localvibe` schema.
- Admin access is granted by setting the `role` field to `1` for a user in the `users` table.

###  How to create an admin user:

1. Register a user via the website.
2. Copy the user's ID from the URL (e.g., `/profile/4`).
3. In MySQL terminal:

```sql
USE localvibe;
UPDATE users
SET role = 1
WHERE id = 4;
```

(Change `4` to the correct user ID.)

---

## 📬 Notifications

- The system sends both internal and email notifications.
- Email delivery requires working SMTP credentials (preferably via MailerSend).

---

## 👤 Author

This project was developed by **Grigory Ivashkin**,  
a student of the **University of Latvia**,  
as part of a qualification defense project in 2025.
