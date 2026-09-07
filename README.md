# Job Board Backend API

A RESTful backend for a **Job Board / Job Portal application** built with **Node.js, Express.js, MongoDB, and Mongoose**.

The API supports job seekers, employers, and administrators with features including authentication, job management, job applications, user profiles, resume generation, skill assessments, Excel/CSV imports, and administrative management.

## 🚀 Live API

**Production API:**

`https://job-backend-lac.vercel.app/`

**Health / Welcome endpoint:**

`https://job-backend-lac.vercel.app/`

Response:

```text
Welcome to JobPortal Backend!
```

---

# ✨ Features

## Authentication

* User registration
* User login
* JWT authentication
* Role-based authorization
* Forgot password
* OTP generation
* OTP verification
* Password reset
* OTP expiration after 5 minutes

## Job Management

### Public

* Get all jobs
* Search jobs by title
* Filter jobs by location
* Filter jobs by skills
* Pagination
* Get job details

### Employers

* Create jobs
* Update jobs
* Delete own jobs
* Bulk import jobs using CSV

### Administrators

* Activate/inactivate jobs
* View all jobs
* Delete jobs

## Application Management

* Apply for jobs
* Prevent duplicate applications
* View personal applications
* Employers can view applicants
* Accept/reject applications

## User Profile

Users can manage:

* Personal information
* Education
* Experience
* Projects
* Skills
* Job title
* Experience level
* Contact information
* Portfolio website
* LinkedIn
* GitHub
* Certifications
* Achievements

## Resume Generation

* Generate a professional PDF resume
* Resume generated from user profile data
* HTML-based resume template
* PDF generation using Puppeteer
* Chromium support for Vercel/serverless deployment

## Skill Assessment

* Start job-specific tests
* Randomly select questions
* Retrieve test questions
* Submit answers
* Automatic evaluation
* Positive and negative marks
* Calculate score
* Calculate percentage
* View detailed test results
* Import questions using Excel

## Admin Management

Administrators can:

* View all users
* Delete users
* View all jobs
* Delete jobs
* View platform statistics

---

# 🛠️ Tech Stack

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| Node.js             | Runtime                 |
| Express.js          | REST API framework      |
| MongoDB             | Database                |
| Mongoose            | MongoDB ODM             |
| JWT                 | Authentication          |
| bcryptjs            | Password hashing        |
| Nodemailer          | Email / OTP             |
| OTP Generator       | OTP functionality       |
| Multer              | File uploads            |
| csv-parser          | CSV processing          |
| XLSX                | Excel processing        |
| Puppeteer Core      | PDF generation          |
| @sparticuz/chromium | Chromium for serverless |
| CORS                | Cross-origin requests   |
| Vercel              | Production deployment   |

---

# 📁 Project Structure

```text
JobBackend-main/
│
├── api/
│   └── index.js
│
├── public/
│   └── images/
│       └── jobboard.png
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── mail.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── applicationController.js
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── resumeController.js
│   │   ├── testController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/
│   │   ├── Application.js
│   │   ├── Job.js
│   │   ├── TestAttempt.js
│   │   ├── TestQuestion.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── jobroutes.js
│   │   ├── resumeRoutes.js
│   │   ├── testRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── mailSend.js
│   │   └── resumeTemplate.js
│   │
│   └── server.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── vercel.json
```

---

# 🔐 Authentication

Authentication uses **JWT Bearer tokens**.

After login or registration, the API returns a token.

Send the token with protected requests:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

JWT tokens expire after:

```text
7 days
```

---

# 👤 User Roles

The backend supports three roles:

```text
jobseeker
employer
admin
```

### Job Seeker

Can:

* Browse jobs
* Apply for jobs
* View applications
* Manage profile
* Manage education
* Manage experience
* Manage projects
* Manage skills
* Generate resume
* Take job assessments

### Employer

Can:

* Create jobs
* Update own jobs
* Delete own jobs
* Import jobs using CSV
* View applicants
* Update application status

### Admin

Can:

* View users
* Delete users
* View jobs
* Delete jobs
* Change job status
* View platform statistics

---

# 🌐 API Endpoints

All API routes use:

```text
/api
```

Therefore the production API follows:

```text
https://job-backend-lac.vercel.app/api
```

---

# 🔑 Authentication API

## Register

```http
POST /api/auth/register
```

### Request

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "password123",
  "role": "jobseeker"
}
```

Employer registration can include:

```json
{
  "name": "Company Admin",
  "email": "company@example.com",
  "password": "password123",
  "role": "employer",
  "companyName": "Example Technologies"
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "USER_ID",
    "name": "Rahul",
    "email": "rahul@example.com",
    "role": "jobseeker",
    "token": "JWT_TOKEN"
  }
}
```

---

## Login

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Login successfull",
  "token": "JWT_TOKEN",
  "data": {
    "_id": "USER_ID",
    "name": "Rahul",
    "role": "jobseeker"
  }
}
```

---

# 🔑 Password Reset

## Send OTP

```http
POST /api/auth/forgot-password
```

### Request

```json
{
  "email": "rahul@example.com"
}
```

The OTP is sent through email and is valid for **5 minutes**.

---

## Verify OTP

```http
POST /api/auth/verify-otp
```

### Request

```json
{
  "email": "rahul@example.com",
  "otp": "123456"
}
```

---

## Reset Password

```http
POST /api/auth/reset-password
```

### Request

```json
{
  "email": "rahul@example.com",
  "newPassword": "newPassword123"
}
```

---

# 💼 Job API

## Get Jobs

```http
GET /api/jobs
```

Supported query parameters:

```text
title
location
skills
page
limit
```

Example:

```http
GET /api/jobs?title=React&location=Pune&skills=React,JavaScript&page=1&limit=10
```

### Response

```json
{
  "total": 25,
  "page": 1,
  "pages": 3,
  "jobs": [
    {
      "_id": "JOB_ID",
      "title": "Frontend Developer",
      "description": "Build modern web applications.",
      "location": "Pune",
      "salary": "15000-25000",
      "skills": [
        "React",
        "JavaScript",
        "Tailwind CSS"
      ],
      "company": {
        "_id": "COMPANY_ID",
        "name": "Company Admin",
        "companyName": "Example Technologies"
      },
      "status": "active"
    }
  ]
}
```

---

## Get Job Details

```http
GET /api/jobs/:id
```

Example:

```http
GET /api/jobs/65abc123...
```

---

# 🏢 Employer Job Management

All employer endpoints require:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Create Job

```http
POST /api/jobs
```

### Request

```json
{
  "title": "Frontend Developer",
  "description": "Looking for a React developer.",
  "location": "Pune",
  "salary": "15000-25000",
  "skills": [
    "React",
    "JavaScript",
    "Tailwind CSS"
  ]
}
```

---

## Update Job

```http
PUT /api/jobs/update-job/:id
```

---

## Delete Job

```http
DELETE /api/jobs/:id
```

Only the employer who owns the job can update or delete it.

---

## Bulk Import Jobs

```http
POST /api/jobs/bulk-import
```

Content type:

```text
multipart/form-data
```

File field:

```text
file
```

Expected CSV columns:

```text
title
description
location
salary
skills
```

Example:

```csv
title,description,location,salary,skills
Frontend Developer,React development,Pune,15000-25000,"React,JavaScript,Tailwind"
Backend Developer,Node.js development,Pune,20000-30000,"Node.js,Express,MongoDB"
```

---

# 📝 Application API

## Apply for Job

```http
POST /api/applications/apply/:jobId
```

Requires authentication.

No request body is required.

The backend prevents the same user from applying to the same job more than once.

---

## Get My Applications

```http
GET /api/applications/my-applications
```

Requires authentication.

### Response

```json
{
  "status": true,
  "message": "Data fetch successfully !",
  "data": []
}
```

---

## Get Job Applicants

```http
GET /api/applications/applicants/:jobId
```

Requires authentication.

Returns applicant information including:

* Name
* Email
* Resume

---

## Update Application Status

```http
PUT /api/applications/status/:id
```

### Request

```json
{
  "status": "accepted"
}
```

Supported statuses:

```text
pending
accepted
rejected
```

---

# 👤 User Profile API

All user profile endpoints require authentication.

## Update Profile

```http
PUT /api/users/profile
```

Example:

```json
{
  "firstName": "Rahul",
  "lastName": "Girmaji",
  "phone": "9876543210",
  "location": "Pune",
  "bio": "Frontend developer passionate about React.",
  "jobTitle": "React Developer",
  "experienceLevel": "Fresher",
  "website": "https://example.com",
  "linkedin": "https://linkedin.com/in/example",
  "github": "https://github.com/example"
}
```

---

# 🎓 Education

## Add Education

```http
POST /api/users/education
```

Example:

```json
{
  "degree": "MCA",
  "institution": "Pune University",
  "marks": "80%",
  "startYear": "2022",
  "endYear": "2024",
  "description": "Master of Computer Applications"
}
```

---

## Update Education

```http
PUT /api/users/education/:eduId
```

---

## Delete Education

```http
DELETE /api/users/education/:eduId
```

---

# 💼 Experience

## Add Experience

```http
POST /api/users/experience
```

Example:

```json
{
  "title": "Frontend Developer",
  "company": "Example Technologies",
  "startDate": "2025",
  "endDate": "2026",
  "description": "Developed React applications."
}
```

---

## Update Experience

```http
PUT /api/users/experience/:expId
```

---

## Delete Experience

```http
DELETE /api/users/experience/:expId
```

---

# 🚀 Projects

## Add Project

```http
POST /api/users/projects
```

Example:

```json
{
  "title": "Job Board",
  "description": "A full-stack job portal.",
  "techStack": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "link": "https://example.com"
}
```

---

# 🛠️ Skills

## Update Skills

```http
PUT /api/users/skills
```

Example:

```json
{
  "skills": [
    "React",
    "JavaScript",
    "TypeScript",
    "Tailwind CSS",
    "Node.js"
  ]
}
```

---

# 📄 Resume Generation

## Generate Resume PDF

```http
GET /api/resume/generate
```

Requires authentication.

Response:

```http
Content-Type: application/pdf
Content-Disposition: attachment; filename=resume.pdf
```

The resume is generated dynamically from the user's profile information.

The generated resume contains:

* Name
* Job title
* Contact information
* Skills
* About Me
* Education
* Work Experience
* Projects

The backend uses:

* Puppeteer
* Chromium
* HTML/CSS resume template

---

# 🧪 Skill Assessment API

The assessment system provides job-specific multiple-choice tests.

A candidate must first apply for the corresponding job.

---

## Start Test

```http
POST /api/tests/start
```

### Request

```json
{
  "jobId": "JOB_ID",
  "questionCount": 10
}
```

`questionCount` is optional.

The backend randomly selects questions from the active question pool.

---

## Get Test Questions

```http
GET /api/tests/:attemptId/questions
```

Example:

```http
GET /api/tests/ATTEMPT_ID/questions
```

The candidate receives:

* Question ID
* Question number
* Marks
* Question type
* Difficulty
* Question text
* Available options

Correct answers are intentionally not returned.

---

## Submit Test

```http
POST /api/tests/:attemptId/submit
```

### Request

```json
{
  "responses": [
    {
      "questionId": "QUESTION_ID",
      "selectedOptionIds": [
        "OPTION_ID"
      ]
    }
  ]
}
```

The backend automatically:

* Checks answers
* Calculates marks
* Applies negative marks
* Calculates final score
* Marks the attempt as completed

---

## Get Test Result

```http
GET /api/tests/:attemptId/result
```

The result includes:

* Candidate
* Job
* Application
* Test status
* Total marks
* Score
* Percentage
* Timing information
* Question-by-question results

Example result structure:

```json
{
  "success": true,
  "message": "Test result fetched successfully",
  "data": {
    "attemptId": "ATTEMPT_ID",
    "status": "COMPLETED",
    "result": {
      "totalMarks": 10,
      "score": 8,
      "percentage": 80
    }
  }
}
```

---

# 📥 Bulk Import Test Questions

## Import Questions Using Excel

```http
POST /api/tests/questions/bulk-import
```

Content type:

```text
multipart/form-data
```

Required fields:

```text
jobId
file
```

The uploaded Excel file must contain:

```text
Question
A
B
C
D
Answer
Level
Topic
SubTopic
```

Example:

| Question       | A       | B        | C  | D       | Answer | Level | Topic | SubTopic |
| -------------- | ------- | -------- | -- | ------- | ------ | ----- | ----- | -------- |
| What is React? | Library | Database | OS | Browser | A      | easy  | React | Basics   |

Supported difficulty values:

```text
easy
mid
medium
hard
```

The backend normalizes:

```text
mid → medium
```

The import response provides:

* Total rows received
* Total questions imported
* Total skipped
* Row-level validation errors

---

# 👑 Admin API

Admin endpoints require:

```http
Authorization: Bearer YOUR_ADMIN_JWT_TOKEN
```

The authenticated user must have:

```text
role = admin
```

---

## Get All Users

```http
GET /api/admin/users
```

Passwords are excluded from the response.

---

## Delete User

```http
DELETE /api/admin/users/:id
```

---

## Get All Jobs

```http
GET /api/admin/jobs
```

---

## Delete Job

```http
DELETE /api/admin/jobs/:id
```

---

## Update Job Status

```http
PATCH /api/jobs/status/:id
```

### Request

```json
{
  "status": "active"
}
```

Supported values:

```text
active
inactive
```

Only administrators can update job status.

---

## Platform Statistics

```http
GET /api/admin/stats
```

Returns:

```json
{
  "totalUsers": 100,
  "totalJobs": 50,
  "activeJobs": 40,
  "inactiveJobs": 10,
  "totalApplications": 250
}
```

---

# 🗄️ Database Models

## User

The User model contains:

```text
name
email
password
role
firstName
lastName
phone
location
bio
jobTitle
experienceLevel
website
linkedin
github
education
experience
projects
skills
certifications
achievements
resume
profileImage
companyName
otp
otpExpiry
createdAt
updatedAt
```

---

## Job

```text
title
description
location
salary
skills
company
status
createdAt
updatedAt
```

Job status:

```text
active
inactive
```

---

## Application

```text
job
applicant
status
createdAt
updatedAt
```

Application status:

```text
pending
accepted
rejected
```

---

## TestQuestion

```text
job
jobRole
type
difficulty
questionText
options
marks
negativeMarks
topic
subTopics
isActive
createdAt
updatedAt
```

Question types:

```text
single_choice
multiple_choice
true_false
```

Difficulty:

```text
easy
medium
hard
```

---

## TestAttempt

```text
candidate
job
application
status
attemptQuestions
responses
totalMarks
score
durationMinutes
startedAt
submittedAt
createdAt
updatedAt
```

Attempt status:

```text
IN_PROGRESS
COMPLETED
EXPIRED
```

---

# 🔒 Middleware

The backend uses multiple middleware layers.

## Authentication Middleware

`authMiddleware.js`

Validates:

```http
Authorization: Bearer TOKEN
```

and retrieves the authenticated user.

---

## Employer Middleware

`roleMiddleware.js`

Only users with:

```text
role = employer
```

can access employer job management endpoints.

---

## Admin Middleware

`adminMiddleware.js`

Only users with:

```text
role = admin
```

can access administrative endpoints.

---

## Upload Middleware

`multer` is used for:

* CSV job imports
* Excel question imports

---

# ⚙️ Environment Variables

Create a `.env` file locally:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
PORT=5000
```

For production, configure environment variables through the Vercel project settings.

### Important

Never commit `.env` files to GitHub.

---

# 💻 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd JobBackend-main
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env
```

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
JWT_SECRET=your_secret_key
NODE_ENV=development
PORT=5000
```

## 4. Start development server

```bash
npm run dev
```

The local API will run on:

```text
http://localhost:5000
```

---

# 📡 API Base URLs

### Local

```text
http://localhost:5000/api
```

### Production

```text
https://job-backend-lac.vercel.app/api
```

---

# 🌐 CORS

The backend currently allows cross-origin requests:

```text
origin: *
```

Allowed methods:

```text
GET
POST
PUT
DELETE
OPTIONS
PATCH
```

Allowed headers:

```text
Content-Type
Authorization
```

This allows the React frontend to communicate with the deployed API.

---

# ☁️ Vercel Deployment

The backend is configured for Vercel using:

```text
vercel.json
```

Current configuration routes incoming requests to:

```text
/api/index.js
```

The Vercel entry point imports:

```js
const app = require("./../src/server");
```

The Express application is exported for serverless execution.

---

# 🔄 Frontend Integration

A React frontend can use Axios with:

```js
import axios from "axios";

const api = axios.create({
  baseURL: "https://job-backend-lac.vercel.app/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
```

For authenticated requests:

```js
api.defaults.headers.common[
  "Authorization"
] = `Bearer ${token}`;
```

Or use an Axios request interceptor.

Example:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

---

# 🧭 Example Frontend API Structure

A React frontend can organize API services like:

```text
src/
├── api/
│   ├── axios.js
│   ├── authApi.js
│   ├── jobApi.js
│   ├── applicationApi.js
│   ├── userApi.js
│   ├── resumeApi.js
│   ├── testApi.js
│   └── adminApi.js
│
├── components/
├── pages/
├── layouts/
├── context/
├── hooks/
└── routes/
```

This keeps the frontend separated from backend implementation details.

---

# 🧪 API Testing

You can test the API using:

* Postman
* Thunder Client
* Insomnia
* cURL
* React / Axios

Example:

```bash
curl https://job-backend-lac.vercel.app/
```

Expected response:

```text
Welcome to JobPortal Backend!
```

---

# 📌 Important API Behavior

### Job Search

The job listing API supports:

```text
title
location
skills
page
limit
```

### Duplicate Applications

A user cannot apply to the same job twice.

### Test Requirement

A candidate must have an application for a job before starting its assessment.

### Test Attempts

An in-progress test can be resumed.

A completed test cannot be attempted again.

### Resume

The resume is generated from the authenticated user's stored profile information.

---

# 🚧 Current Limitations / Considerations

The following areas may require additional hardening before a large-scale production deployment:

* Add stronger request validation using a validation library such as Joi, Zod, or express-validator.
* Add rate limiting for authentication and OTP endpoints.
* Add stricter CORS configuration for production.
* Add centralized error-handling middleware.
* Add API request logging.
* Add automated tests.
* Add stronger authorization checks for employer applicant endpoints.
* Add file type and file size validation for uploads.
* Use persistent/object storage such as S3 for uploaded files instead of relying on local serverless storage.
* Add pagination to admin user/job listings.
* Add proper frontend/backend API documentation using OpenAPI/Swagger.
* Add database indexes for frequently searched fields.
* Add security headers using Helmet.
* Add input sanitization and additional security validation.

---

# 🔐 Security Notice

**Never commit secrets, passwords, API keys, SMTP credentials, MongoDB credentials, or JWT secrets to GitHub.**

Use environment variables for all sensitive configuration.

If any SMTP credential or other secret has previously been committed to the repository, **rotate/revoke that credential immediately** and replace it with environment-based configuration.

Recommended environment variables include:

```env
MONGO_URI=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

---

# 📄 License

Add your preferred license here.

Example:

```text
MIT License
```

---

# 👨‍💻 Author

**Rahul Girmaji**

Backend developed using:

```text
Node.js
Express.js
MongoDB
Mongoose
JWT
Puppeteer
Vercel
```

---

# ⭐ Project

If you find this project useful, consider giving the repository a ⭐ on GitHub.
