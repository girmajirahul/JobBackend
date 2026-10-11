# Job Board Backend API

REST API for a job portal built with **Node.js, Express, MongoDB, and Mongoose**.

**Production API:** https://job-backend-lac.vercel.app  
**API Base URL:** https://job-backend-lac.vercel.app/api

## Features

- JWT authentication, role-based access, and password reset with email OTP
- Job search, filtering, pagination, and employer job management
- Job applications and application status updates
- User profiles, education, experience, projects, and skills
- PDF resume generation
- Job-specific skill assessments and results
- CSV job import and Excel question import
- Admin management for users, jobs, and platform statistics

## Tech Stack

- Node.js and Express
- MongoDB and Mongoose
- JWT and bcryptjs
- Nodemailer and OTP Generator
- Multer, csv-parser, and XLSX
- Puppeteer Core and Chromium
- Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
PORT=5000
EMAIL_USER=example@gmail.com
EMAIL_PASS=YOUR_APP_PASSWORD
```

Configure any email/SMTP variables required by your mail setup. Never commit `.env` or secrets to GitHub.

### 3. Run locally

```bash
npm run dev
```

The API runs at `http://localhost:5000` (unless you configure a different port).

## Authentication

Protected endpoints require a JWT:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Supported roles: `jobseeker`, `employer`, and `admin`.

## Main Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/forgot-password` | Request password-reset OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/jobs` | List and search jobs |
| GET | `/api/jobs/:id` | Get job details |
| POST | `/api/jobs` | Create a job (employer) |
| POST | `/api/applications/apply/:jobId` | Apply for a job |
| GET | `/api/applications/my-applications` | View your applications |
| GET | `/api/resume/generate` | Generate a PDF resume |
| POST | `/api/tests/start` | Start a skill assessment |
| GET | `/api/admin/stats` | View platform statistics (admin) |

See the route files in `src/routes/` for the full endpoint list and request details.

## Project Structure

```text
api/
  index.js
src/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
package.json
vercel.json
```

## Testing

Test endpoints with Postman, Thunder Client, Insomnia, or cURL.

## Author

**Rahul Girmaji**
