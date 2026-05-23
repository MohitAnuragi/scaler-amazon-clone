# Amazon Clone – Full Stack E-Commerce Application

A full-stack Amazon-inspired ecommerce application built with React, TypeScript, Express, and MySQL. The project includes product browsing, search and filtering, cart and wishlist management, checkout flow, order history, and order confirmation emails.

---

# Live Features

- Amazon-style responsive UI
- Product search and category filtering
- Product detail pages
- Cart and wishlist functionality
- User authentication
- Checkout and order placement
- Order history page
- Order confirmation emails
- Persistent MySQL database storage

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- React Router
- Zustand
- TanStack Query
- Tailwind CSS
- Axios

## Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- mysql2
- JWT Authentication
- bcryptjs
- Zod Validation
- Winston Logger

## Email Service
- Resend API

---

# Project Structure

```text
scalar-amazon-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.ts
│   │
│   ├── sql/
│   │   └── schema.mysql.sql
│   │
│   ├── scripts/
│   │   ├── init-mysql.ts
│   │   └── seed-mysql.ts
│   │
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── store/
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
```

---

# Screenshots

## Homepage / Deals Section

<img width="1888" height="913" alt="Screenshot 2026-05-23 231030" src="https://github.com/user-attachments/assets/f2806e24-b9ce-481a-b51d-ef6a03955a20" />


## Shopping Cart

<img width="1904" height="909" alt="Screenshot 2026-05-23 231128" src="https://github.com/user-attachments/assets/459ba667-2786-4a60-83df-db99cefdf89b" />

## Order Confirmation

<img width="1866" height="854" alt="Screenshot 2026-05-23 231224" src="https://github.com/user-attachments/assets/fe7eab04-a572-411c-b177-1fd4bc5f7f5c" />

## Product Listing & Filters

<img width="1873" height="887" alt="Screenshot 2026-05-23 231308" src="https://github.com/user-attachments/assets/bac4107e-1a00-4488-a198-b1f075df8975" />

## Your Orders History

<img width="1919" height="814" alt="Screenshot 2026-05-23 231410" src="https://github.com/user-attachments/assets/6cd30232-b308-4cb2-a649-4ca2138fe842" />

---

# Database Design

The MySQL schema includes:

- Users
- Categories
- Products
- Product Images
- Cart Items
- Wishlist Items
- Orders
- Order Items
- Addresses
- Reviews

The database is initialized using SQL scripts and seeded with sample ecommerce data.

---

# Local Setup

## Prerequisites

- Node.js 18+
- npm
- MySQL 8+

---

# 1. Clone Repository

```bash
https://github.com/MohitAnuragi/scaler-amazon-clone.git
cd scaler-amazon-clone
```

---

# 2. Install Dependencies

## Backend

```bash
cd backend
npm install
```

## Frontend

```bash
cd ../frontend
npm install
```

---

# 3. Configure Environment Variables

## Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=amazon_clone

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173

LOG_LEVEL=info

RESEND_API_KEY=your_resend_api_key
RESEND_FROM=Amazon.in <onboarding@resend.dev>
```

## Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

# 4. Create Database

Create a MySQL database manually:

```sql
CREATE DATABASE amazon_clone;
```

---

# 5. Initialize Database

```bash
cd backend

npm run db:init
npm run db:seed
```

This creates all tables and inserts sample products.

---

# 6. Run the Project

## Start Backend

```bash
cd backend
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Start Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Build Commands

## Backend

```bash
npm run build
npm start
```

## Frontend

```bash
npm run build
```

---

# API Overview

Base URL:

```text
/api/v1
```

## Main Endpoints

```text
GET    /products
GET    /products/featured
GET    /categories

POST   /auth/signup
POST   /auth/login
GET    /auth/me

GET    /cart
POST   /cart

GET    /wishlist
POST   /wishlist

POST   /orders
GET    /orders
```

---

# Deployment

## Frontend
- Vercel

## Backend
- Railway

## Database
- Railway MySQL

---

# Known Limitations

- Payment gateway is not integrated
- Resend email delivery may require a verified domain for external recipients
- Product catalog uses seeded demo data

---

# Future Improvements

- Payment gateway integration
- Product reviews and ratings
- Admin dashboard
- Better product recommendations
- Inventory management
- Email queue system

---

# Seed Account

```text
Email: customer@example.com
Password: password123
```

---

# License

MIT

## Contact 
Email : anuragimohit468@gmail.com
