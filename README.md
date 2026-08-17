# TaskMatrix

> **Sprint 14 — Track A: Frontend Specialists**  
> **Theme:** Next.js Authentication Architecture & Route Guards

TaskMatrix is a modern project-management workspace built with Next.js. The application provides an authenticated workspace where users can manage projects, tasks, and team members from a centralized dashboard.

This sprint focuses on establishing a reliable authentication architecture using **NextAuth.js**, protecting application routes, maintaining authentication state, and providing a structured foundation for the authenticated TaskMatrix workspace.

---

## Table of Contents

- [Overview](#overview)
- [Sprint Scope](#sprint-scope)
- [Key Features](#key-features)
- [Application Flow](#application-flow)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Authentication Architecture](#authentication-architecture)
- [Route Protection](#route-protection)
- [State Management](#state-management)
- [Workspace Modules](#workspace-modules)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Development](#development)
- [Production Build](#production-build)
- [Sprint Deliverables & DoD](#sprint-deliverables--dod)
- [Testing & Verification](#testing--verification)
- [Security Notes](#security-notes)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

TaskMatrix is designed as an authenticated project-management workspace.

The current application flow is intentionally focused on the core workspace:

```text
Register
   ↓
Login
   ↓
NextAuth Authentication
   ↓
Protected Dashboard
   ↓
┌─────────────┬─────────────┬─────────────┐
│  Projects   │    Tasks    │    Team     │
└─────────────┴─────────────┴─────────────┘
   ↓
Logout
   ↓
Login
```

The dashboard acts as the central workspace and provides an overview of project and task activity.

---

# Sprint Scope

## Track A — Frontend Specialists

### Theme

**Next.js Authentication Architecture & Route Guards**

The sprint was divided into three implementation phases.

---

## Phase 1 — Base Architecture (P0)

### Mandatory Deliverables

- Next.js App Router architecture
- `/login` route
- `/register` route
- `/dashboard` route
- Login form
- Registration form
- Functional form state management

### Status

**Complete**

---

## Phase 2 — State & Integration (P1)

### Priority Deliverables

- NextAuth.js integration
- Registration flow
- Login flow
- Authentication session
- Authenticated user payload
- Authenticated application/API requests

### Status

**Complete**

---

## Phase 3 — Advanced Optimization (P2)

### Advanced Deliverables

- Protected dashboard routes
- Redirect unauthenticated users to `/login`
- Maintain authenticated access after refresh
- Synchronize authenticated user information with global application state
- Verify logout behavior
- Verify direct access to protected routes

### Status

**Verified**

---

# Key Features

## Authentication

- User registration
- User login
- NextAuth.js authentication
- Session-based authentication
- Authenticated user state
- Logout functionality

## Route Protection

Protected application routes prevent unauthenticated access.

Expected behavior:

```text
Unauthenticated User
        ↓
   /dashboard
        ↓
     Redirect
        ↓
     /login
```

Authenticated users can access the workspace normally.

---

## Dashboard

The dashboard provides a centralized overview of:

- Active projects
- Total tasks
- Completed tasks
- Pending tasks
- Active project progress
- Team activity
- Recent tasks

---

## Projects

The project workspace supports project management through authenticated API operations.

Current project operations include:

- Fetch projects
- Create projects
- Update projects
- Delete projects
- Track project status
- Track priority
- Track team members
- Track due dates
- Display project progress

---

## Tasks

The Tasks module provides task-management functionality connected to the workspace.

It supports the project's task workflow and contributes data to the dashboard overview.

---

## Team

The Team module provides workspace member management and team-related information.

The dashboard and workspace are structured around collaboration between projects, tasks, and team members.

---

# Application Flow

```text
                     ┌──────────────┐
                     │   Register   │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Login     │
                     └──────┬───────┘
                            │
                            ▼
                  ┌────────────────────┐
                  │  NextAuth Session  │
                  └─────────┬──────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Route Protection│
                   └────────┬────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   Dashboard  │
                     └──────┬───────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ Projects │  │   Tasks  │  │   Team   │
        └──────────┘  └──────────┘  └──────────┘
```

---

# Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React framework and App Router |
| React | User interface |
| NextAuth.js | Authentication and session management |
| Redux Toolkit | Global application state |
| Lucide React | Interface icons |
| JavaScript | Application development |
| CSS | Styling |
| REST API | Backend communication |
| Git & GitHub | Version control |
| Vercel | Deployment platform |

---

# Project Structure

The application follows a modular Next.js structure.

```text
taskmatrix-next/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── team/
│   │
│   ├── components/
│   │   ├── DashboardLayout
│   │   ├── Sidebar
│   │   └── other shared components
│   │
│   ├── store/
│   │   ├── authSlice
│   │   ├── projectsSlice
│   │   ├── tasksSlice
│   │   └── store configuration
│   │
│   └── styles/
│
├── public/
│
├── .env.local
├── package.json
├── next.config.*
└── README.md
```

> File and directory names may vary slightly depending on the current implementation. The structure above describes the application's architectural organization.

---

# Authentication Architecture

TaskMatrix uses **NextAuth.js** for authentication.

The authentication flow is based on the following model:

```text
User
 ↓
Login / Register
 ↓
NextAuth
 ↓
Authenticated Session
 ↓
User Payload
 ↓
Global Application State
 ↓
Protected Workspace
```

Authenticated API requests use the session's access token when required.

Example architecture:

```text
NextAuth Session
       ↓
session.user.accessToken
       ↓
Authorization Header
       ↓
TaskMatrix API
```

Authenticated requests follow the standard Bearer token pattern:

```text
Authorization: Bearer <access-token>
```

---

# Route Protection

The dashboard and authenticated workspace are protected from unauthenticated access.

### Authenticated request

```text
User → /dashboard
       ↓
Authentication verified
       ↓
Dashboard
```

### Unauthenticated request

```text
User → /dashboard
       ↓
Authentication missing
       ↓
/login
```

This prevents users from directly accessing protected application areas without authentication.

---

# State Management

Redux Toolkit is used for global application state.

The application separates authentication and workspace data into logical slices.

Conceptually:

```text
Redux Store
│
├── auth
│   ├── user
│   ├── authentication state
│   └── loading state
│
├── projects
│   ├── items
│   ├── status
│   └── error
│
└── tasks
    ├── items
    ├── status
    └── error
```

The authenticated user state is synchronized with the authentication session so that the dashboard can access the current user's information.

---

# Workspace Modules

The current sidebar intentionally focuses on the core TaskMatrix workflow.

```text
MAIN MENU

Dashboard
Projects
Tasks
Team
```

The current Sprint does not require Calendar or Analytics as core deliverables, so they are not required in the primary navigation.

This keeps the workspace focused and avoids adding incomplete functionality solely for navigation purposes.

---

# Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_secret

NEXT_PUBLIC_TASKMATRIX_API_URL=http://localhost:5000
```

Use the actual values required by your local and production environments.

## Important

Never commit secrets to GitHub.

Do not place private credentials directly inside:

- React components
- Redux slices
- API source files
- committed `.env` files

For production, configure environment variables through the deployment platform.

---

# Getting Started

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd taskmatrix-next
```

## 2. Install dependencies

```bash
npm install
```

## 3. Configure environment variables

Create:

```text
.env.local
```

and add the required authentication and API configuration.

## 4. Start the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:3000
```

---

# Development

Run the development server:

```bash
npm run dev
```

Build the production application:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run linting if configured:

```bash
npm run lint
```

---

# Production Build

Before deployment, verify:

- Authentication environment variables are configured
- `NEXTAUTH_SECRET` is configured securely
- Production API URL is configured
- Authentication callback configuration is correct
- Protected routes work in production
- Login and logout work after deployment
- Direct dashboard access redirects correctly when logged out
- API requests use the production backend

---

# Sprint Deliverables & DoD

## P0 — Base Architecture

- [x] Next.js App Router
- [x] `/login`
- [x] `/register`
- [x] `/dashboard`
- [x] Login form
- [x] Registration form
- [x] Functional form state

## P1 — State & Integration

- [x] NextAuth.js integration
- [x] Registration flow
- [x] Login flow
- [x] Authentication session
- [x] User payload
- [x] Authenticated API communication

## P2 — Advanced Optimization

- [x] Protected dashboard
- [x] Unauthenticated redirect
- [x] Authenticated dashboard access
- [x] Session persistence verification
- [x] Authentication state synchronization
- [x] Logout verification
- [x] Direct protected-route verification

---

# Testing & Verification

The authentication architecture has been verified against the following scenarios.

| Test Case | Expected Result | Status |
|---|---|---|
| Register new user | Account created | ✅ |
| Login with valid credentials | Session established | ✅ |
| Open dashboard while authenticated | Dashboard opens | ✅ |
| Open dashboard while unauthenticated | Redirect to login | ✅ |
| Refresh authenticated dashboard | Session remains available | ✅ |
| Logout | Authentication removed | ✅ |
| Access dashboard after logout | Redirect to login | ✅ |
| Direct URL access while logged out | Protected | ✅ |
| Authenticated API request | Authorization supplied | ✅ |

---

# Security Notes

Authentication credentials and secrets must be stored in environment variables.

Recommended practices:

- Never commit `.env.local`
- Never expose `NEXTAUTH_SECRET`
- Never hard-code access tokens
- Validate authentication on protected server/API boundaries
- Use HTTPS in production
- Keep production credentials separate from development credentials
- Do not trust client-side authentication checks as the only security boundary

---

# Future Enhancements

The current Sprint focuses on authentication architecture and protected routes.

Possible future enhancements include:

- Calendar integration
- Advanced analytics dashboard
- Notification system
- Granular role-based access control
- More detailed team permissions
- Project activity history
- Advanced task filtering
- Real-time collaboration
- Audit logs
- Enhanced security settings

These features can be introduced in later development phases without changing the core authentication architecture.

---

# Deployment

TaskMatrix can be deployed using a Next.js-compatible hosting platform such as Vercel.

Before deployment:

```text
Build
 ↓
Configure Environment Variables
 ↓
Deploy
 ↓
Verify Authentication
 ↓
Verify Protected Routes
 ↓
Verify API Communication
```

After deployment, verify both:

```text
Frontend
http(s)://<production-domain>
```

and the configured backend API.

---

# Project Status

## Sprint 14 — Track A

**Status: COMPLETE**

### Authentication Architecture

**P0:** Complete  
**P1:** Complete  
**P2:** Verified

The Sprint's primary objective—building a Next.js authentication architecture with authenticated state, protected routes, and a functional dashboard entry point—has been completed.

---

# Author

**TaskMatrix**

Developed as part of the **Sprint 14 — Track A: Frontend Specialists** project.

---

# License

This project is intended for educational, development, and project-evaluation purposes unless otherwise specified by the repository owner.
