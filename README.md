# 🚗 Car Rental System – MERN Stack Application

A full-featured **Car Rental Web Application** developed using the **MERN stack** (MongoDB, Express.js, React, Node.js) with **PostgreSQL** (via **Prisma ORM**) replacing MongoDB for relational data handling. This application allows users to browse, book, and manage car rentals easily with a modern frontend and robust backend infrastructure.

---

## 🔥 Features

- 🚙 **Browse Car Listings** – View detailed car profiles with high-quality images  
- 📆 **Booking System** – Reserve cars for specific dates with real-time availability  
- 🔐 **Authentication & Authorization** – Secure login using JWT, with protected routes  
- ☁️ **Cloudinary Integration** – Upload and store car images in the cloud  
- 🧑‍💼 **Admin/User Dashboards** – Separate dashboards for users and admins *(scalable)*  
- 📊 **PostgreSQL + Prisma** – Structured database with powerful ORM  
- ✨ **Modern UI** – Built using React + TailwindCSS with smooth navigation

---

## 🧰 Tech Stack

| Category        | Tech Used                          |
|-----------------|------------------------------------|
| **Frontend**    | React, TailwindCSS,zustand         |
| **Backend**     | Node.js, Express.js                |
| **Database**    | PostgreSQL with Prisma ORM         |
| **Auth**        | JWT (JSON Web Token)               |
| **Media Upload**| Cloudinary                         |
| **Dev Tools**   | Vite, Prisma Studio, Postman       |

---

## 🛠️ Local Setup Instructions

### 🔐 Environment Variables

Create a `.env` file in the `backend/` directory and add the following:

```env
# Database connection
DATABASE_URL=postgresql://CarRental_owner:npg_0KTGqHZk2CJt@ep-sparkling-tree-a13zl6ca-pooler.ap-southeast-1.aws.neon.tech/CarRental?sslmode=require

# Cloudinary config
CLOUDINARY_CLOUD_NAME=dkegbcjgg
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# JWT secret
JWT_SECRET=your_jwt_secret_key

# Node environment
NODE_ENV=development
```

backend setup

Navigate to backend folder:-
``` js
cd backend
```

Install dependencies:-
```js
npm install
```

Run Prisma migrations:-
```js
npx prisma migrate dev --name init
```

Generate Prisma client:-
```js
npx prisma generate
```

Start development server:-
```js
npm run dev
```

frontend setup

Navigate to frontend folder:-
```js
cd frontend
```

Install dependencies:-
```js
npm install
```

Start the frontend application:-
```js
npm run dev
```

Made by Yogesh Choudhary