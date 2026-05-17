# Smart Leads Dashboard

### 🌐 Live Demo: [https://smart-leads-dashboard-dun.vercel.app/](https://smart-leads-dashboard-dun.vercel.app/)

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

### Auth Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`

### Leads Endpoints
- `GET    /api/leads`
- `GET    /api/leads/:id`
- `POST   /api/leads`
- `PUT    /api/leads/:id`
- `DELETE /api/leads/:id`
- `GET    /api/leads/export/csv`

### Query Params for GET /api/leads

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