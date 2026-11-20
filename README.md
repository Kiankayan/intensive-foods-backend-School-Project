# Intensive Foods – Backend

A RESTful backend API for the Intensive Foods e-commerce application, built with Node.js, Express, TypeScript, Prisma and PostgreSQL.

## Overview

This project provides the backend functionality for an e-commerce application. It handles user authentication, food products, categories and database interactions through a structured REST API.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-based authentication
- User management
- Food product management (CRUD)
- Category management
- Role-based authorization for administrators
- Request validation using Zod
- PostgreSQL database integration using Prisma ORM

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT)
- bcrypt
- Zod

## Project Structure

The backend is organized into separate routes, controllers, middleware and database-related components to keep the application structured and maintainable.

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Kiankayan/intensive-foods-backend-School-Project.git
```

Navigate into the project directory:

```bash
cd intensive-foods-backend-School-Project
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

Do not commit your `.env` file or expose sensitive credentials.

## Database

The application uses PostgreSQL with Prisma ORM for database access and management.

## Purpose

This project was developed as part of the Intensive Code Full Stack Developer program to gain practical experience in backend development, REST API design, authentication, authorization and database integration.
