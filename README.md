# Campus Cart

Campus Cart is a full stack campus shopping application. Customers can browse products, manage a cart, pay for orders, and view their order history. Admins can manage the catalog and orders and view store statistics.

## Features

- Browse the product catalog and view product details
- Register and log in
- Add items to a cart and check out with Razorpay
- View customer profile and order history
- Admin dashboard for products, orders, and store statistics
- Upload product images using Cloudinary
- Send account and order emails

## Tech stack

- React, Vite, React Router, and Redux Toolkit
- Node.js and Express
- MongoDB and Mongoose
- Razorpay, Cloudinary, and Nodemailer

## Requirements

- Node.js and npm
- MongoDB
- Razorpay credentials to process payments
- Cloudinary credentials for image uploads
- Email account credentials for email notifications

## Run locally

Install all dependencies from the repository root:

```sh
npm run install:all
```

Configure the backend settings described below, then start the frontend and backend:

```sh
npm run dev
```

The frontend runs at `http://localhost:3000`. The backend runs at `http://localhost:5000` by default.

To run one part of the application, use `npm run dev:client` or `npm run dev:server` from the repository root.

## Configuration

Create `backend/.env` with the backend secrets and service settings:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=replace-with-a-long-random-secret
SESSION_SECRET=replace-with-a-long-random-secret
EMAIL_USER=your-email-address
EMAIL_PASS=your-email-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:3000
MONGODB_URI=your-mongodb-connection-string
```

The local development URLs are also allowed directly.

Set `MONGODB_URI` to your own database connection string. For local development only, the app falls back to `backend/config/development.json` when the variable is not set. Production must set `MONGODB_URI` in the host's secret environment settings. Never publish database credentials, API keys, email passwords, or `.env` files.

## API routes

| Base path | Purpose |
| --- | --- |
| `/users` | Registration, login, logout, and user routes |
| `/products` | Product catalog and product management |
| `/orders` | Customer and admin order routes |
| `/payment` | Razorpay order creation and payment verification |
| `/analytics` | Admin store statistics |

Protected routes require a valid login; admin routes require an admin account.

## Build

Create the frontend production build:

```sh
npm run build
```

The output is written to `frontend/dist`.

## Render

The repository build command is:

```sh
npm run install:all && npm run build
```

The backend start command is:

```sh
npm start
```

The backend serves the built frontend from `frontend/dist`. Add `MONGODB_URI` and the other backend secrets in Render's Environment settings, then set the start command to `npm start`. Deploy the latest commit from the intended branch.

## Security

- Keep credentials out of Git and the README.
- Use separate credentials for development and production.
- Restrict MongoDB network access and configure CORS for the production frontend URL.
