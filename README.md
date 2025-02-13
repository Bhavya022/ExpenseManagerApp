# ExpenseManagerApp
Expense Manager App
This is a full-stack Expense Manager application that allows users to:

Track expenses and income by category
View statistics on a dashboard
Generate and export expense reports as PDFs
Authenticate users securely
Tech Stack
Frontend:
React + TypeScript + Vite
TailwindCSS for styling
Shadcn UI components
React Query for data fetching
React Hook Form for form handling
Wouter for client-side routing
Backend:
Node.js + Express.js
PostgreSQL Database
Drizzle ORM for database operations
Passport.js for authentication
Express Session for managing user sessions
Features
User Authentication (Login/Register)
Expense Tracking with Categories
Dashboard with Expense Statistics
PDF Report Generation
Responsive Design for Mobile and Desktop
Folder Structure
graphql
Copy
Edit
ExpenseManagerApp/  
├── client/                # Frontend (React + Vite)  
│   ├── src/  
│   │   ├── components/    # UI components (Shadcn UI)  
│   │   ├── pages/         # Pages (Auth, Dashboard, Reports)  
│   │   ├── hooks/         # Custom React hooks  
│   │   └── main.tsx       # React entry point  
│   └── index.html         # HTML template  
│   └── vite.config.ts     # Vite configuration  
│  
├── server/                # Backend (Express.js)  
│   ├── index.ts           # Server entry point  
│   ├── routes.ts          # API routes  
│   ├── auth.ts            # Passport.js Authentication  
│   ├── db.ts              # Database connection (Drizzle ORM)  
│   └── storage.ts         # Database operations  
│  
└── shared/                # Shared types and schemas  
    └── schema.ts          # TypeScript types and Drizzle schema  
Environment Variables
Create a .env file in the root directory with the following values:

env
Copy
Edit
# Database
DATABASE_URL=your_postgresql_database_url

# Authentication
SESSION_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend
VITE_API_BASE_URL=https://your-backend-api-url
Installation
Clone the Repository
bash
Copy
Edit
git clone https://github.com/YourUsername/ExpenseManagerApp.git
cd ExpenseManagerApp
Install Dependencies
bash
Copy
Edit
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
Setup Database
Create a PostgreSQL database
Run migrations using Drizzle ORM
bash
Copy
Edit
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
Start Development Server
bash
Copy
Edit
# Run Backend
cd server
npm run dev

# Run Frontend
cd ../client
npm run dev
Build and Deployment
Frontend (Netlify)
Build the Frontend
bash
Copy
Edit
cd client
npm run build
Deploy on Netlify
Build Command: npm run build
Publish Directory: dist
Environment Variables: Add VITE_API_BASE_URL
Backend (Render)
Install Render CLI and deploy using:
bash
Copy
Edit
render.yaml
API Endpoints
Auth Routes
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
GET /api/auth/logout - Logout user
Expense Routes
GET /api/expenses - Get all expenses for the logged-in user
POST /api/expenses - Add a new expense
DELETE /api/expenses/:id - Delete an expense
