# Amazon Clone - Full-Stack E-Commerce Platform

A production-style Amazon-inspired ecommerce application built with React, TypeScript, Express, and MySQL. The project focuses on a realistic shopping flow: browsing products, searching and filtering catalog items, managing cart and wishlist state, checking out with saved addresses, placing orders, and viewing order history.

## Overview

This repository contains a full-stack ecommerce experience with:

- Amazon-like responsive UI
- Category-aware search and filtering
- Product listing, detail, cart, checkout, wishlist, and order history flows
- Seeded catalog data with categories, images, ratings, reviews, and stock
- Backend order processing with confirmation email support
- Clean separation between frontend presentation and backend business logic

The goal of the project is to feel like a real internship or portfolio submission rather than a toy demo: the app uses typed APIs, reusable components, URL-based filters, server-backed state, and a structured data model.

## Key Features

### Storefront

- Amazon-style homepage with banners, category sections, and featured products
- Product listing with pagination, sort options, search, and category filters
- Product detail pages with image gallery, specs, reviews, and stock information
- Responsive product cards and reusable image fallbacks
- Live navbar search suggestions with category-aware filtering

### Shopping Flow

- Add to cart from listing and detail pages
- Update quantities, remove items, and compute totals
- Wishlist support with dedicated page
- Checkout with address selection and order summary
- Order confirmation and order history pages

### Backend

- Express API with layered architecture
- MySQL with mysql2 connection pooling and parameterized SQL
- Runtime validation using Zod
- Structured logging with Winston
- Category-aware product filtering, sorting, and search
- Seed script for a realistic ecommerce catalog

### Order Emails

- Backend email service for order confirmation notifications
- Reusable order email template
- Non-blocking email dispatch so checkout remains fast and reliable

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express 5
- TypeScript
- mysql2
- MySQL 8+
- Zod
- Winston
- bcryptjs

## Architecture

The app follows a straightforward full-stack structure:

- **Frontend** handles rendering, routing, client state, and UI interactions.
- **Backend** exposes REST APIs for catalog, cart, auth, wishlist, addresses, and orders.
- **Database** stores users, products, categories, images, reviews, carts, wishlists, and orders.
- **Seed scripts** populate the catalog with realistic product records and category coverage.

### Data Flow

1. The frontend requests data from the API using typed Axios calls.
2. TanStack Query caches catalog and product data.
3. URL query params represent search, category, sort, and pagination state.
4. The backend applies the same filters at the database layer through MySQL queries.
5. Order placement writes data in a transaction and triggers email delivery asynchronously.

## Project Structure

```text
amazon-clone/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── sql/
│   │   └── schema.mysql.sql
│   ├── catalog/
│   ├── scripts/
│   │   ├── init-mysql.ts
│   │   └── seed-mysql.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── config/
    │   ├── hooks/
    │   ├── layouts/
    │   ├── pages/
    │   ├── routes/
    │   ├── store/
    │   ├── types/
    │   └── utils/
    └── package.json
```

## Screenshots

Add screenshots here when publishing the project:

```md
![Homepage](docs/screenshots/homepage.png)
![Product Listing](docs/screenshots/product-listing.png)
![Product Detail](docs/screenshots/product-detail.png)
![Cart](docs/screenshots/cart.png)
![Checkout](docs/screenshots/checkout.png)
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8+

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

#### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=amazon_clone
JWT_SECRET=change-me-to-a-long-random-secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

If you enable order email delivery, configure the email provider variables required by the backend email service in your local environment as well.

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_DEFAULT_USER_ID=<user-id-from-seed>
```

### 3. Set up the database

```bash
cd backend
# Create the database in MySQL first, e.g. CREATE DATABASE amazon_clone;
npm run db:init
npm run db:seed
```

### 4. Run the app locally

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

### 5. Build for production

```bash
cd backend
npm run build

cd ../frontend
npm run build
```

## Useful Scripts

### Backend

- `npm run dev` - Start the API in development mode
- `npm run build` - Compile TypeScript
- `npm run start` - Run the compiled server
- `npm run db:init` - Apply MySQL schema (`sql/schema.mysql.sql`)
- `npm run db:seed` - Seed sample ecommerce data

### Frontend

- `npm run dev` - Start the Vite dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## API Notes

Base URL:

```text
http://localhost:5000/api/v1
```

### Main endpoints

- `GET /products`
- `GET /products/featured`
- `GET /products/search`
- `GET /products/slug/:slug`
- `GET /categories`
- `GET /cart`
- `POST /cart`
- `GET /wishlist`
- `POST /wishlist`
- `POST /orders`
- `GET /orders`
- `GET /addresses`

### Filtering

The product listing API supports:

- category
- search
- price range
- rating
- brand
- stock status
- featured-only
- sort order
- pagination

The frontend keeps these values in the URL so search and filtering remain shareable and survive refreshes.

## Database Model

The MySQL schema is centered around:

- Users
- Categories
- Products
- Product images
- Product specifications
- Cart items
- Wishlist items
- Orders
- Order items
- Reviews
- Addresses

Seed data creates a realistic catalog across major ecommerce categories, including electronics, mobiles, fashion, beauty, books, sports, gaming, grocery, toys, and home essentials.

## Performance and UX Considerations

- Debounced navbar search
- React Query caching for catalog requests
- URL-driven filters and pagination
- Lazy-loaded route chunks
- Reusable image fallback handling
- Responsive mobile and desktop navigation
- Skeleton loading states for smoother perceived performance

## Deployment Notes

### Frontend

The frontend can be deployed to Vercel, Netlify, or any static hosting provider that supports Vite builds.

### Backend

The backend is suitable for Render, Railway, Fly.io, or a similar Node.js hosting platform.

### Database

Use a managed MySQL provider such as PlanetScale, AWS RDS MySQL, Railway MySQL, or Render MySQL.

## Future Improvements

- Persistent job queue for email delivery
- Search indexing for larger catalogs
- Payment gateway integration
- Real inventory reservation
- Analytics dashboard for admins
- Review moderation tools
- Saved search and recommendation improvements

## Troubleshooting

### Build issues

```bash
cd backend && npm run build
cd frontend && npm run build
```

### Database connection issues

- Confirm MySQL is running and the database exists
- Check `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE`
- Re-run `npm run db:init` and `npm run db:seed` if the catalog is empty

## Seed Account

After seeding:

- Email: `customer@example.com`
- Password: `password123`

## License

MIT

