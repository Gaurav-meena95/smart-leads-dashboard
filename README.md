# Smart Leads Dashboard

### 🌐 Live Demo (Frontend): [https://smart-leads-dashboard-dun.vercel.app/](https://smart-leads-dashboard-dun.vercel.app/)
### 🔌 Live API (Backend): [https://smart-leads-dashboard-y7gf.vercel.app/](https://smart-leads-dashboard-y7gf.vercel.app/)

## Tech Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB (Mongoose)
- **Containerization**: Docker, Docker Compose

## Features
- Authentication (JWT)
- Leads CRUD
- Advanced Filtering & Search
- Pagination
- Role-Based Access (Admin/Sales)
- CSV Export
- Debounced Search
- Dark Mode (bonus)

## Project Structure
```text
smart-leads-dashboard/
├── client/          (React frontend)
├── server/          (Node backend)
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v20+
- MongoDB (ya Docker)
- npm

### Local Setup (Without Docker)

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repo_url>
   cd smart-leads-dashboard
   ```

2. Setup the server:
   ```bash
   cd server
   npm install
   cp .env.example .env # Set your own environment variables
   npm run dev
   ```

3. Setup the client:
   ```bash
   cd ../client
   npm install
   cp .env.example .env # Set your own environment variables
   npm run dev
   ```

### Setup With Docker

1. Ensure Docker and Docker Compose are installed.
2. Create `.env` file at the root level using `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Run Docker Compose:
   ```bash
   docker-compose up --build
   ```
4. Open the application in your browser: [http://localhost:5173](http://localhost:5173)

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB Connection URI | `mongodb://localhost:27017/smart-leads` |
| `JWT_SECRET` | Secret key for JWT signing | `your_super_secret_jwt_key_here` |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `VITE_API_URL` | Frontend API URL | `http://localhost:3000/api` |

## API Documentation

All request payloads are JSON, and authorization headers expect a Bearer JWT Token (`Authorization: Bearer <token>`).

### 🔑 Authentication Endpoints

#### 1. Register User
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "role": "sales" 
  }
  ```
  *(Note: Password must be at least 8 characters, containing at least 1 letter, 1 number, and 1 special character).*
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "sales"
    }
  }
  ```

#### 2. User Login
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "Password123!",
    "role": "sales"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "60d0fe4f5311236168a109ca",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "sales"
      },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

---

### 📋 Leads Management Endpoints

#### 1. Get All Leads (Paginated, Searchable, Filterable)
- **Endpoint:** `GET /api/leads`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leads fetched successfully",
    "data": [
      {
        "_id": "60d0fe4f5311236168a109cb",
        "name": "Alice Smith",
        "email": "alice@leads.com",
        "status": "Qualified",
        "source": "Web",
        "createdBy": "60d0fe4f5311236168a109ca",
        "createdAt": "2026-05-18T05:00:00.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```
  *(Note: Enforces strict Role-Based Access Isolation. Sales users will only receive leads owned by them. Admins receive global access).*

#### 2. Get Lead Details
- **Endpoint:** `GET /api/leads/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead details fetched successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Alice Smith",
      "email": "alice@leads.com",
      "status": "Qualified",
      "source": "Web",
      "createdBy": "60d0fe4f5311236168a109ca"
    }
  }
  ```

#### 3. Create Lead
- **Endpoint:** `POST /api/leads`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "Alice Smith",
    "email": "alice@leads.com",
    "status": "Qualified",
    "source": "Web"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Lead created successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Alice Smith",
      "email": "alice@leads.com",
      "status": "Qualified",
      "source": "Web",
      "createdBy": "60d0fe4f5311236168a109ca"
    }
  }
  ```

#### 4. Update Lead
- **Endpoint:** `PUT /api/leads/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** (Partial updates allowed)
  ```json
  {
    "status": "Won"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead updated successfully",
    "data": {
      "_id": "60d0fe4f5311236168a109cb",
      "name": "Alice Smith",
      "email": "alice@leads.com",
      "status": "Won",
      "source": "Web"
    }
  }
  ```

#### 5. Delete Lead (Admin Only)
- **Endpoint:** `DELETE /api/leads/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Lead deleted successfully"
  }
  ```
  *(Note: Returning 403 Forbidden for Sales users attempting this operation).*

#### 6. Export Filtered Leads to CSV
- **Endpoint:** `GET /api/leads/export/csv`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** CSV Attachment Stream (`leads.csv`)

### Query Params for GET /api/leads and GET /api/leads/export/csv

| Param | Type | Description |
|---|---|---|
| `page` | Number | Page number for pagination |
| `limit` | Number | Number of items per page |
| `search` | String | Search query for name or email |
| `status` | String | Filter leads by status |
| `source` | String | Filter leads by source |
| `sort` | String | Sort order (e.g., latest, oldest) |

## Default Admin Account
You can login using the following credentials if the database is seeded:
- **Email:** admin@smartleads.com
- **Password:** admin123

## Git Commit Convention
- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance tasks, dependencies
- `docs:` for documentation updates