# 🗓️ Event Management Platform - Backend

This project was developed as part of the **Purwadhika Full-stack Web Development Bootcamp**.  
It serves as the backend for an **Event Management Platform**, enabling organizers to create and promote events, while attendees can browse, register, and purchase tickets.

---

## 🎯 Objective

The main goal of this MVP is to build a simple, functional, and scalable **event management system** that connects event organizers and attendees through a seamless platform.

---

## ⚙️ Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js  
- **ORM:** Prisma  
- **Database:** PostgreSQL  
- **Language:** TypeScript  
- **Authentication:** JWT  
- **Mail Service:** Nodemailer  
- **Deployment:** Railway  
- **API Testing:** Postman  

---

## 🚀 Core Features

### 🧩 Event Discovery & Creation
- Organizers can **create, edit, and manage events** (name, category, date, price, available seats, etc.)
- Customers can **browse and search events** by category or location.
- Integrated **voucher and promotion system** with start/end dates.
- Supports **free and paid events**, with IDR as the default currency.

### 💳 Event Transactions
- **Customers can buy tickets** and upload payment proof.
- Automatic **status transitions**:
  - `WAITING_FOR_PAYMENT`
  - `WAITING_FOR_CONFIRMATION`
  - `DONE`
  - `REJECTED`
  - `EXPIRED`
  - `CANCELED`
- 2-hour countdown for payment proof upload; 3-day auto-cancel for unconfirmed transactions.
- Implements **SQL transactions** for rollback, point/voucher restoration, and seat reallocation.

### ⭐ Reviews & Ratings
- Customers can **rate and review events** after attending.
- Reviews are displayed on the **organizer’s profile**.

### 👥 Authentication & Authorization
- **Role-based access control** (Customer, Organizer)
- **Referral system**:
  - Registering via referral gives new users a **discount coupon**.
  - The referrer earns **10,000 points**.
- **JWT authentication**, password reset, and profile management.

### 📊 Event Management Dashboard
- Organizers can **view statistics** (daily, monthly, yearly).
- Manage transactions (accept/reject with reason).
- **Automatic email notifications** using Nodemailer for transaction updates.
- Attendee list view per event.

---

## 🧠 System Highlights

- Protected routes with role-based access
- Debounce search bar for better UX
- SQL transaction for complex operations
- Responsive and optimized API structure
- Unit tests for core business flows

---

## 🧪 API Endpoints Overview

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/register` | User registration with optional referral |
| `POST` | `/auth/login` | User login and JWT issuance |
| `GET` | `/events` | Browse all events |
| `POST` | `/events` | Create event (Organizer only) |
| `GET` | `/transactions` | Get user transactions |
| `POST` | `/transactions` | Create new ticket transaction |
| `PUT` | `/transactions/:id` | Update status (Organizer only) |
| `POST` | `/reviews` | Submit event review |

---

## 🧾 References

Inspired by popular event platforms:
- [Eventbrite](https://www.eventbrite.com/)
- [Eventbookings](https://www.eventbookings.com/)
- [TicketTailor](https://www.tickettailor.com/)
- [Loket](https://www.loket.com/)

---

## 👨‍💻 Author

**Muhammad Hanif Fauzi**  
Full-stack Web Developer  
📧 [muhaniffauzi@gmail.com](mailto:muhaniffauzi@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/muhaniffauzi/) | [GitHub](https://github.com/hanfauzi)

**Yusril Haidar Hafis**
Full-stack Web Developer  
[GitHub](https://github.com/hafisyusril)

---

## 🏫 About the Project

This backend project was developed collaboratively as part of the **Purwadhika Full-stack Web Development Bootcamp Final Project**, under real-world simulation of agile team development.
