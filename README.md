# 🔐 SecureSpace

**A Full-Stack Authentication System**

SecureSpace is a full-stack web application developed to provide secure user authentication and account management using React.js, Node.js, Express.js, and MongoDB.

## ✨ Features

- User registration and login
- Password hashing and verification
- JWT-based authentication
- HTTP-only cookie management
- Protected routes
- User session verification
- Logout functionality
- Forgot password functionality
- Password reset using secure, time-limited tokens
- Email delivery for password recovery using Nodemailer

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- JavaScript
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST API

### Backend Dependencies

| Package | Usage |
|---|---|
| dotenv | Environment variable configuration |
| cors | Cross-origin resource sharing |
| cookie-parser | Reading cookies from HTTP requests |
| bcrypt | Password hashing and verification |
| jsonwebtoken | JWT generation and verification |
| node:crypto | Secure password-reset token generation |
| Nodemailer | Sending password-reset emails |

## 📁 Project Structure

```text
SecureSpace/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── BrandPanel.jsx
│   │   ├── pages/
│   │   │   ├── SignUp.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── index.js
├── db.js
├── users.schema.js
├── mailer.js
├── create-test-account.js
├── test-email.js
├── test-oauth.js
├── package.json
├── .gitignore
└── README.md
```

## 🔐 Authentication & Security

SecureSpace implements several authentication and security mechanisms:

- Passwords are hashed using bcrypt before being stored.
- JWTs are used to authenticate users.
- Authentication cookies are configured as HTTP-only.
- Protected endpoints verify user authentication.
- Password reset tokens are generated using Node.js crypto.
- Reset tokens are hashed before being stored in the database.
- Password reset tokens have an expiration time.
- CORS is configured to allow communication between the frontend and backend.
- Sensitive configuration values are managed through environment variables.

## 📧 Email Integration

Nodemailer was implemented in SecureSpace to send password-reset emails.

When a user requests a password reset:

1. The backend generates a secure, time-limited reset token.
2. The reset token is hashed and stored in the database.
3. Nodemailer sends a password-reset link to the user's email address.
4. The user can use the link to set a new password.

**Ethereal Email** was used to test and preview outgoing emails during development.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate a user |
| POST | `/logout` | Log out the current user |
| GET | `/api/auth/me` | Retrieve the authenticated user |
| GET | `/api/health` | Check API status |
| POST | `/api/auth/forgot-password` | Request a password reset |
| POST | `/api/auth/reset-password` | Reset the user's password |

## ⚙️ Installation & Setup

### Prerequisites

- Node.js
- npm
- MongoDB database

### 1. Clone the repository

```bash
git clone https://github.com/douaadh/SecureSpace.git
cd SecureSpace
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and configure the required environment variables.

Example:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

Add the email configuration variables required by `mailer.js`.

**Important:** Never commit your `.env` file or expose private credentials.

### 4. Start the backend

```bash
node index.js
```

The backend runs on:

```text
http://localhost:3000
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd Frontend
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite.

## 👩‍💻 Author

**Douaa**

Computer Science Student | Web Developer

GitHub: [@douaadh](https://github.com/douaadh)

---

⭐ Thanks for checking out SecureSpace!
