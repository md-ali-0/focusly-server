# Time Management and Focus Tracker Backend

This backend is designed to support the **Time Management and Focus Tracker** application, allowing users to log their study sessions, track focus metrics, and manage streaks through secure and scalable APIs.

---

## Features

1. **User Authentication**:
   - Secure JWT-based authentication.
2. **Focus Sessions**:
   - Log focus sessions with duration and timestamps.
3. **Focus Metrics**:
   - Fetch daily and weekly metrics, including total focus time and session counts.
4. **Gamification**:
   - Track and calculate user streaks for consistent study habits.

---

## API Endpoints

### 1. Login
- **URL**: `/api/auth/sigin`
- **Method**: `POST`
- **Description**: Authenticate a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "admin@example.com"
  }
  ```
- **Response**:
  ```json
  {
    "token": "<JWT_TOKEN>"
  }
  ```

### 2. Log Focus Session
- **URL**: `/api/focus-session`
- **Method**: `POST`
- **Description**: Log a completed focus session.
- **Headers**:
  ```json
  {
    "Authorization":"token"
  }
  ```
- **Request Body**:
  ```json
  {
    "duration": 25
  }
  ```
- **Response**:
  ```json
  {
    "message": "Session logged successfully."
  }
  ```

### 3. Get Focus Metrics
- **URL**: `/api/focus-metrics`
- **Method**: `GET`
- **Description**: Fetch daily and weekly focus metrics.
- **Headers**:
  ```json
  {
    "Authorization":"token"
  }
  ```
- **Response**:
  ```json
  {
    "dailyMetrics": {
      "totalFocusTime": 50,
      "sessionsCompleted": 2
    },
    "weeklyMetrics": {
      "totalFocusTime": 200,
      "sessionsCompleted": 8
    }
  }
  ```

### 4. Get Streaks
- **URL**: `/api/streaks`
- **Method**: `GET`
- **Description**: Fetch the current and longest streaks for a user.
- **Headers**:
  ```json
  {
    "Authorization":"token"
  }
  ```
- **Response**:
  ```json
  {
    "currentStreak": 5,
    "longestStreak": 10
  }
  ```

---

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Framework for building web applications and APIs.
- **JWT**: For authentication and secure API access.
- **In-memory Mock Storage**: Simulating data storage for focus sessions and streaks.

---

## Prerequisites

- **Node.js**: Ensure Node.js is installed on your system.

---

## Installation and Running Locally

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   node server.js
   ```

4. Access the API at:
   ```
   http://localhost:3000
   ```

---

## Testing the API

You can test the API endpoints using tools like:
- **Postman**
- **cURL**

---

## Sample Users

You can use the following sample users for testing:

| Role       | Email                  |   Password             |
|------------|------------------------|------------------------|
| USER       | ali@gmail.com          |  123456

---

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it as per the license terms.

---
