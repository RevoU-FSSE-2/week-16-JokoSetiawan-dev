[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/GB9tUzun)

# Assignment Week 16 Joko Setiawan FSSE Revou Student

## Overview
This project aims to create a secure and robust backend system for user authentication and authorization. It provides features like access tokens, refresh tokens, token expiration, logout functionality, cookie clearance, password reset, login rate limiting, and role-based access control (RBAC) to enhance the security and user experience.

## Features

### Access Token
- Provides access tokens for authenticated users.
- Access tokens are time-limited to ensure security.
- Tokens are required for authorized access to protected resources.

### Refresh Token
- Refresh tokens are issued to users for obtaining new access tokens.
- Increases user convenience by avoiding frequent logins.
- Refresh tokens are also time-limited for added security.

### Token Expiration
- Access tokens and refresh tokens have a specified expiration time.
- Tokens expire automatically, enhancing security by reducing the risk of token misuse.

### Logout and Clearing Cookies
- Users can log out to invalidate their current access token.
- Clearing cookies upon logout enhances security and user privacy.

### Password Reset
- Allows users to reset their passwords securely in case of forgotten or compromised passwords.
- Follows a secure password reset process, typically involving username verification.

### Login Rate Limiting
- Implement a rate-limiting mechanism to prevent brute-force attacks.
- Limits the number of login requests allowed per time interval (e.g., 5 failed login attempts per 15 minutes).

### Role-Based Access Control (RBAC)
- Assigns different roles to users based on their authorization level (e.g., admin, sales).
- Provides fine-grained access control to different parts of the application.

## API Endpoints
#### - Auth Endpoint
- `POST /auth/register`: User registration.
- `POST /auth/login`: User login to obtain access tokens, and refresh token.
- `GET /auth/logout`: User logout and clearing cookies.

#### - Reset Password Endpoint
- `POST /password/resetrequest`: Password reset request.
- `POST /password/resetpassword`: Reset password.

#### - User Endpoint
- `POST /user`: Creat user.
- `GET /user`: Find all user.
- `GET /user/:id`: Find user by id.
- `PUT /user/:id`: Update user data.
- `DELETE /user/:id`: Delete user data.

#### - Sell Out Endpoint
- `GET /sellout`: Find all sellout data.
- `GET /sellout/:id`: Find sellout data by id.
- `POST /sellout`: Create sellout data.
- `PUT /sellout/:id`: Update sellout data.
- `DELETE /sellout/:id`: Delete sellout data.

## Getting Started
1. Clone the project from the repository.
2. Install the required dependencies using `npm install`.
3. Configure the database connection and environment variables.
4. Start the server with `npm start`.