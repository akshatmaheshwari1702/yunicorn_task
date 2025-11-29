# Employment System API

Backend for an Employment System connecting Employers and Job Seekers.

## Features

- **Roles**: Admin, Employer, Job Seeker
- **Authentication**: JWT-based auth with secure password hashing
- **Jobs**: Create, Update, Delete, Search
- **Applications**: Apply, Withdraw, Accept/Reject
- **Offer Letter**: Auto-generated PDF with QR code

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT & Bcrypt
- PDFKit & QRCode

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Copy `.env.sample` to `.env` and update values if needed.
   ```bash
   cp .env.sample .env
   ```
4. **Start MongoDB**
   Ensure MongoDB is running on your system or update `MONGODB_URI` in `.env`.
5. **Run the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Reference

### Authentication

#### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Employer" // or "Job Seeker"
  }
  ```

#### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: Returns JWT `token` which must be included in the `Authorization` header as `Bearer <token>` for private routes.

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Access**: Private

### Jobs

#### Create Job (Employer only)
- **URL**: `/jobs`
- **Method**: `POST`
- **Access**: Private (Employer)
- **Body**:
  ```json
  {
    "title": "Software Engineer",
    "description": "We are looking for a developer...",
    "location": "Remote",
    "employmentType": "Full-time" // "Full-time", "Part-time", "Contract", "Internship"
  }
  ```

#### Update Job (Employer only)
- **URL**: `/jobs/:id`
- **Method**: `PUT`
- **Access**: Private (Employer - Owner)
- **Body**: (Any fields to update)

#### Delete Job (Employer only)
- **URL**: `/jobs/:id`
- **Method**: `DELETE`
- **Access**: Private (Employer - Owner)

#### Search Jobs
- **URL**: `/jobs`
- **Method**: `GET`
- **Access**: Public
- **Query Params**: `title`, `location`, `employmentType`
- **Example**: `/jobs?title=Software&location=Remote`

#### Get Job Details
- **URL**: `/jobs/:id`
- **Method**: `GET`
- **Access**: Public

### Applications (Job Seeker)

#### Apply for Job
- **URL**: `/applications`
- **Method**: `POST`
- **Access**: Private (Job Seeker)
- **Body**:
  ```json
  {
    "jobId": "651234567890abcdef123456"
  }
  ```

#### View My Applications
- **URL**: `/applications`
- **Method**: `GET`
- **Access**: Private (Job Seeker)

#### Get Application Details
- **URL**: `/applications/:id`
- **Method**: `GET`
- **Access**: Private (Job Seeker)

#### Withdraw Application
- **URL**: `/applications/:id`
- **Method**: `DELETE`
- **Access**: Private (Job Seeker)
- **Note**: Can only withdraw if status is `PENDING`.

#### Download Offer Letter
- **URL**: `/applications/:id/offer`
- **Method**: `GET`
- **Access**: Private (Job Seeker)
- **Note**: Only available if status is `ACCEPTED`. Returns a PDF file.

### Employer Actions

#### View Applications for My Jobs
- **URL**: `/employer/applications`
- **Method**: `GET`
- **Access**: Private (Employer)
- **Query Params**: `status` (PENDING, ACCEPTED, REJECTED)

#### Accept/Reject Application
- **URL**: `/employer/applications/:id`
- **Method**: `PUT`
- **Access**: Private (Employer)
- **Body**:
  ```json
  {
    "status": "ACCEPTED" // or "REJECTED"
  }
  ```

### Admin Actions

#### Get All Users
- **URL**: `/admin/users`
- **Method**: `GET`
- **Access**: Private (Admin)
- **Query Params**: `role`

#### Get All Jobs
- **URL**: `/admin/jobs`
- **Method**: `GET`
- **Access**: Private (Admin)

#### Delete Job
- **URL**: `/admin/jobs/:id`
- **Method**: `DELETE`
- **Access**: Private (Admin)

#### Get All Applications
- **URL**: `/admin/applications`
- **Method**: `GET`
- **Access**: Private (Admin)

## Testing

Run the verification script to simulate a full user flow:
```bash
node scripts/test_flow.js
```
