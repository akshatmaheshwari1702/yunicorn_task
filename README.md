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

## API Endpoints

### Auth
- `POST /auth/register` - Register (Employer/Job Seeker)
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user

### Jobs
- `POST /jobs` - Create Job (Employer)
- `PUT /jobs/:id` - Update Job (Employer)
- `DELETE /jobs/:id` - Delete Job (Employer)
- `GET /jobs` - Search Jobs (Public)
- `GET /jobs/:id` - Get Job Details (Public)

### Applications
- `POST /applications` - Apply (Job Seeker)
- `GET /applications` - View Own Applications (Job Seeker)
- `GET /applications/:id` - Get Application Details (Job Seeker)
- `DELETE /applications/:id` - Withdraw Application (Job Seeker)
- `GET /employer/applications` - View Job Applications (Employer)
- `PUT /employer/applications/:id` - Accept/Reject Application (Employer)
- `GET /applications/:id/offer` - Download Offer Letter (Job Seeker)

### Admin
- `GET /admin/users` - Get All Users
- `GET /admin/jobs` - Get All Jobs
- `DELETE /admin/jobs/:id` - Delete Job
- `GET /admin/applications` - Get All Applications

## Testing

Run the verification script to simulate a full user flow:
```bash
node scripts/test_flow.js
```
