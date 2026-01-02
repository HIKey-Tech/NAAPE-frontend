# NAAPE Project Documentation

## 1. Project Overview

NAAPE (National Association of Aircraft Pilots & Engineers) is a full‑stack web platform designed to manage member registration, authentication, profiles, publications, notifications, and membership applications for aviation professionals in Nigeria.

The system consists of:

* **Frontend**: Next.js (App Router), React, TailwindCSS, Framer Motion
* **Backend**: Node.js, Express, MongoDB (Mongoose)
* **Authentication**: JWT (custom), optional Clerk (carefully isolated to server components)
* **Email Services**: SendGrid
* **File Storage**: Cloudinary
* **State & Data**: React Query, Zustand

---

## 2. Architecture Overview

```
Client (Next.js)
   │
   ├── Auth / UI / Forms
   │
   ▼
API Gateway (Axios)
   │
   ▼
Express API (Node.js)
   │
   ├── Controllers
   ├── Services
   ├── Middleware
   ├── Models (Mongoose)
   │
   ▼
MongoDB Atlas
```

---

## 3. Tech Stack

### Frontend

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS
* Framer Motion
* React Hook Form + Zod
* React Query
* Zustand
* Axios

### Backend

* Node.js + Express
* MongoDB + Mongoose
* JWT Authentication
* SendGrid (Email)
* Cloudinary (Media)

---

## 4. Environment Variables

### Backend (.env)

```
PORT=10000
MONGO_URI=...
JWT_SECRET=...
SENDGRID_API_KEY=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://naape-backend-0h30.onrender.com/api/v1
```

---

## 5. Backend Structure

```
src/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── utils/
 ├── server.ts
```

### Key Models

#### User Model

* name
* email (unique)
* password (hashed)
* role (admin | editor | member)
* isVerified
* profile (image, bio, phone, organization)
* professional (license, experience)
* resetPasswordToken
* resetPasswordExpire

#### MembershipForm Model

* name
* email
* tel
* address
* designation
* employer
* signature
* date
* timestamps

---

## 6. Authentication Flow

### Registration

1. User submits signup form
2. Backend validates email uniqueness
3. Password is hashed
4. User record is created
5. JWT is returned

### Login

1. User submits credentials
2. Password is compared using bcrypt
3. JWT token issued

### Password Reset

1. User requests reset
2. Token generated and hashed
3. Reset link emailed
4. Token verified
5. Password updated

---

## 7. API Endpoints

### Auth

```
POST   /auth/register
POST   /auth/login
POST   /auth/forgot-password
POST   /auth/reset-password/:token
```

### User

```
GET    /users/profile
PUT    /users/profile
```

### Membership Form

```
POST   /membership-form
GET    /membership-form
GET    /membership-form/:id
```

### Publications

```
POST   /publications
GET    /publications
GET    /publications/:id
```

---

## 8. Frontend Structure

```
app/
 ├── (auth)/
 ├── dashboard/
 ├── components/
 ├── hooks/
 ├── store/
 ├── lib/
```

### State Management

* **Zustand** → UI/global state (auth user, modal state)
* **React Query** → server state (API data, caching)

---

## 9. Error Handling Strategy

### Backend

* Centralized error responses
* Validation errors → 400
* Auth errors → 401 / 403
* Server errors → 500

### Frontend

* Graceful toast messages
* Field‑level validation (Zod)
* API error normalization

---

## 10. Common Issues & Fixes

### 400 Bad Request

* Missing required fields (Mongoose validation)

### 403 SendGrid Error

* Invalid API key
* Unverified sender domain

### Next.js "server-only" Error

* Import Clerk server utilities ONLY in Server Components
* Never import them into `"use client"` files

---

## 11. Deployment

### Backend

* Hosted on Render
* Auto‑deploy from GitHub

### Frontend

* Deployed on Vercel
* Production build enforced

---

## 12. Security Considerations

* Password hashing (bcrypt)
* JWT expiration
* Input validation
* Email verification flow (planned)
* Role‑based access control

---

## 13. Future Enhancements

* Admin dashboard
* Payment integration
* Membership approval workflow
* File uploads for licenses
* Audit logs
* Role permissions

---

## 14. Maintainers

* **Lead Engineer**: Lotanna Chuka
* **Organization**: NAAPE

---

## 15. Appendix

* Coding standards
* API schemas
* Database ERD

---

*End of Documentation*
