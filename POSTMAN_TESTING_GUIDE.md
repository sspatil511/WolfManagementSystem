# Postman Testing Guide — Wolf Management System

This guide provides step-by-step instructions for setting up and testing **every API** in the Wolf Management System using Postman on macOS.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Start the Application](#2-start-the-application)
3. [Import the Postman Collection & Environment](#3-import-the-postman-collection--environment)
4. [Select the Environment](#4-select-the-environment)
5. [Authentication Workflow](#5-authentication-workflow)
6. [Testing the APIs](#6-testing-the-apis)
   - [Auth APIs](#61-auth-apis)
   - [Project APIs](#62-project-apis)
   - [Issue APIs](#63-issue-apis)
   - [Comment APIs](#64-comment-apis)
   - [Message APIs](#65-message-apis)
   - [Subscription APIs](#66-subscription-apis)
   - [Payment APIs](#67-payment-apis)
7. [Recommended Testing Order](#7-recommended-testing-order)
8. [Environment Variables Reference](#8-environment-variables-reference)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

| Requirement | Details |
|---|---|
| **Java** | JDK 17+ installed (`java -version` to verify) |
| **Maven** | 3.8+ or use the included Maven wrapper (`./mvnw`) |
| **MySQL** | 8.0 running on `localhost:3306` |
| **Postman** | Installed on macOS ([download](https://www.postman.com/downloads/)) |

### Set Up the MySQL Database

```bash
# Log in to MySQL
mysql -u root -p

# Create the database
CREATE DATABASE wfs;

# Create a user (or use your existing MySQL user)
CREATE USER 'soham'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON wfs.* TO 'soham'@'localhost';
FLUSH PRIVILEGES;
```

### Set Environment Variables

The application requires several environment variables. Export them in your terminal before starting the server:

```bash
export DB_PASSWORD=your_mysql_password
export MAIL_USERNAME=your_gmail_address
export MAIL_PASSWORD=your_gmail_app_password
export STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key   # optional — only for payment tests
export STRIPE_API_KEY=your_stripe_secret_key                 # optional — only for payment tests
export STRIPE_DEFAULT_PRICE_ID=your_stripe_price_id          # optional — only for payment tests
```

> **Tip:** For Gmail, you need an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password). The mail variables are only required if you test the project invitation feature, which sends emails.

---

## 2. Start the Application

```bash
cd WolfManagementSystem
./mvnw spring-boot:run
```

The server starts on **http://localhost:5454**. Wait until you see a log line similar to:

```
Started WolfManagementSystemApplication in X.XXX seconds
```

Verify the server is running by opening **http://localhost:5454** in your browser — you should get a response (even if it is an error page, it confirms the server is up).

---

## 3. Import the Postman Collection & Environment

Two ready-to-use JSON files are provided in this repository:

| File | Purpose |
|---|---|
| `WolfManagementSystem.postman_collection.json` | All API requests, organized by folder |
| `WolfManagementSystem.postman_environment.json` | Environment variables (base URL, JWT token, IDs) |

### Steps to Import

1. Open **Postman** on your Mac.
2. Click the **Import** button (top-left area of the Postman window).
3. Drag and drop **both** JSON files into the import dialog, or click **Upload Files** and select them.
4. Click **Import** to confirm.

You should now see:
- A collection named **"Wolf Management System API"** in the left sidebar.
- An environment named **"WolfManagementSystem - Local"** in the environment dropdown (top-right).

---

## 4. Select the Environment

1. In the top-right corner of Postman, click the environment dropdown.
2. Select **"WolfManagementSystem - Local"**.

This ensures that variables like `{{base_url}}`, `{{jwt_token}}`, `{{project_id}}`, etc. resolve correctly.

---

## 5. Authentication Workflow

The application uses **JWT (JSON Web Token)** authentication. All `/api/**` endpoints require a valid JWT in the `Authorization` header.

The Postman collection includes **automatic token extraction** — when you run the **Sign Up** or **Sign In** request, a test script saves the returned JWT to the `{{jwt_token}}` environment variable. All subsequent requests use this token automatically.

**You must always run Sign Up or Sign In first before calling any `/api/**` endpoint.**

---

## 6. Testing the APIs

### 6.1 Auth APIs

These are **public** endpoints (no JWT required).

#### POST `/auth/signup` — Register a New User

- **Folder:** Auth → Sign Up
- **Body:**
```json
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "password123"
}
```
- **Expected Response (200):**
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiJ9...",
    "message": "Registration successful"
}
```
- **Auto-action:** The JWT token is saved to `{{jwt_token}}`.

#### POST `/auth/signin` — Log In

- **Folder:** Auth → Sign In
- **Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```
- **Expected Response (200):**
```json
{
    "jwt": "eyJhbGciOiJIUzI1NiJ9...",
    "message": "Login success"
}
```
- **Auto-action:** The JWT token is saved to `{{jwt_token}}`.

---

### 6.2 Project APIs

> **Prerequisite:** Run **Sign Up** or **Sign In** first to obtain a JWT.

#### POST `/api/projects` — Create a Project

- **Folder:** Projects → Create Project
- **Body:**
```json
{
    "name": "My First Project",
    "description": "A sample project for testing",
    "category": "fullstack",
    "tags": ["java", "spring boot", "react"]
}
```
- **Auto-action:** The project ID is saved to `{{project_id}}`.

#### GET `/api/projects` — Get All Projects

- **Folder:** Projects → Get All Projects
- **Query Parameters (optional):**
  - `category` — filter by category (e.g., `fullstack`)
  - `tag` — filter by tag (e.g., `java`)

#### GET `/api/projects/{projectId}` — Get Project by ID

- **Folder:** Projects → Get Project by ID
- Uses `{{project_id}}` from the environment.

#### PATCH `/api/projects/{projectId}` — Update Project

- **Folder:** Projects → Update Project
- **Body:**
```json
{
    "name": "Updated Project Name",
    "description": "Updated description",
    "tags": ["java", "spring boot", "angular"]
}
```

#### GET `/api/projects/search?keyword=sample` — Search Projects

- **Folder:** Projects → Search Projects
- **Query Parameter:** `keyword`

#### GET `/api/projects/{projectId}/chat` — Get Project Chat

- **Folder:** Projects → Get Project Chat

#### POST `/api/projects/invite` — Invite User to Project

- **Folder:** Projects → Invite User to Project
- **Body:**
```json
{
    "email": "teammate@example.com",
    "projectId": 1
}
```
- **Note:** This sends an actual email. Requires `MAIL_USERNAME` and `MAIL_PASSWORD` to be configured.

#### GET `/api/projects/accept_invitation?token={token}` — Accept Invitation

- **Folder:** Projects → Accept Project Invitation
- **Query Parameter:** `token` — the invitation token from the email.
- Set `{{invitation_token}}` in the environment manually after receiving the email.

#### DELETE `/api/projects/{projectId}` — Delete Project

- **Folder:** Projects → Delete Project
- **Note:** Run this last in the project tests to avoid breaking other tests that depend on the project.

---

### 6.3 Issue APIs

> **Prerequisite:** A project must exist. Run **Create Project** first.

#### POST `/api/issues` — Create an Issue

- **Folder:** Issues → Create Issue
- **Body:**
```json
{
    "title": "Fix login bug",
    "description": "Users cannot log in with special characters in password",
    "status": "Open",
    "projectId": 1,
    "priority": "High",
    "dueDate": "2026-03-15"
}
```
- The `projectId` in the body uses the `{{project_id}}` variable.
- **Auto-action:** The issue ID is saved to `{{issue_id}}`.

#### GET `/api/issues/{issueId}` — Get Issue by ID

- **Folder:** Issues → Get Issue by ID

#### GET `/api/issues/project/{projectId}` — Get Issues by Project

- **Folder:** Issues → Get Issues by Project

#### PUT `/api/issues/{issueId}/assignee/{userId}` — Assign Issue to User

- **Folder:** Issues → Assign Issue to User
- Uses `{{issue_id}}` and `{{user_id}}`.
- **Note:** Set `{{user_id}}` manually in the environment. You can find the user ID from the sign-up response or from the project owner field.

#### PUT `/api/issues/{issueId}/status/{status}` — Update Issue Status

- **Folder:** Issues → Update Issue Status
- The status is part of the URL path. Common values: `Open`, `In Progress`, `Closed`.

#### DELETE `/api/issues/{issueId}` — Delete Issue

- **Folder:** Issues → Delete Issue

---

### 6.4 Comment APIs

> **Prerequisite:** An issue must exist. Run **Create Issue** first.

#### POST `/api/comments` — Create a Comment

- **Folder:** Comments → Create Comment
- **Body:**
```json
{
    "issueId": 1,
    "content": "This bug needs to be fixed ASAP."
}
```
- **Auto-action:** The comment ID is saved to `{{comment_id}}`.

#### GET `/api/comments/{issueId}` — Get Comments by Issue

- **Folder:** Comments → Get Comments by Issue

#### DELETE `/api/comments/{commentId}` — Delete Comment

- **Folder:** Comments → Delete Comment

---

### 6.5 Message APIs

> **Prerequisite:** A project (and its chat room) must exist. Run **Create Project** first.

#### POST `/api/messages/send` — Send a Message

- **Folder:** Messages → Send Message
- **Body:**
```json
{
    "senderId": 1,
    "content": "Hello team, let's start working on this project!",
    "projectId": 1
}
```
- Replace `senderId` with `{{user_id}}` and `projectId` with `{{project_id}}`.

#### GET `/api/messages/chat/{projectId}` — Get Messages by Project

- **Folder:** Messages → Get Messages by Project

---

### 6.6 Subscription APIs

#### GET `/api/subscriptions/user` — Get User Subscription

- **Folder:** Subscriptions → Get User Subscription

#### PATCH `/api/subscriptions/upgrade?planType=MONTHLY` — Upgrade Subscription

- **Folder:** Subscriptions → Upgrade Subscription
- **Query Parameter:** `planType` — one of: `FREE`, `MONTHLY`, `ANNUALLY`

---

### 6.7 Payment APIs

> **Prerequisite:** Stripe environment variables (`STRIPE_API_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_DEFAULT_PRICE_ID`) must be set.

#### POST `/api/payments/create-payment-link` — Create Payment Link

- **Folder:** Payments → Create Payment Link
- **Expected Response:**
```json
{
    "paymentLinkId": "plink_...",
    "paymentLinkUrl": "https://checkout.stripe.com/...",
    "publishableKey": "pk_..."
}
```

---

## 7. Recommended Testing Order

Run the requests in this order to build up the necessary data for dependent endpoints:

| Step | Request | Purpose |
|---|---|---|
| 1 | **Auth → Sign Up** | Create a user and get JWT |
| 2 | **Projects → Create Project** | Create a project (saves `project_id`) |
| 3 | **Projects → Get All Projects** | Verify project was created |
| 4 | **Projects → Get Project by ID** | Verify by specific ID |
| 5 | **Projects → Update Project** | Test update |
| 6 | **Projects → Search Projects** | Test search |
| 7 | **Projects → Get Project Chat** | Verify chat was auto-created |
| 8 | **Issues → Create Issue** | Create an issue (saves `issue_id`) |
| 9 | **Issues → Get Issues by Project** | List project issues |
| 10 | **Issues → Get Issue by ID** | Verify by specific ID |
| 11 | **Issues → Update Issue Status** | Change status |
| 12 | **Issues → Assign Issue to User** | Assign to a user (set `user_id` first) |
| 13 | **Comments → Create Comment** | Add a comment (saves `comment_id`) |
| 14 | **Comments → Get Comments by Issue** | List issue comments |
| 15 | **Messages → Send Message** | Send a chat message |
| 16 | **Messages → Get Messages by Project** | List chat messages |
| 17 | **Subscriptions → Get User Subscription** | Check current plan |
| 18 | **Subscriptions → Upgrade Subscription** | Upgrade plan |
| 19 | **Payments → Create Payment Link** | Generate Stripe link (if configured) |
| 20 | **Comments → Delete Comment** | Clean up comment |
| 21 | **Issues → Delete Issue** | Clean up issue |
| 22 | **Projects → Delete Project** | Clean up project |
| 23 | **Projects → Invite User** | Test invitation (optional — requires email config) |
| 24 | **Projects → Accept Invitation** | Accept invite (optional — requires invite token) |

> **Tip:** You can also use Postman's **Collection Runner** to run all requests in sequence. Click the **"..."** menu on the collection → **Run collection** to execute the entire flow automatically.

---

## 8. Environment Variables Reference

| Variable | Set By | Description |
|---|---|---|
| `base_url` | Pre-configured | `http://localhost:5454` |
| `jwt_token` | Auto (Sign Up / Sign In) | JWT for authenticated requests |
| `user_id` | Manual | ID of the logged-in user |
| `project_id` | Auto (Create Project) | ID of the created project |
| `issue_id` | Auto (Create Issue) | ID of the created issue |
| `comment_id` | Auto (Create Comment) | ID of the created comment |
| `invitation_token` | Manual | Token from project invitation email |

> **Setting variables manually:** Click the **eye icon** next to the environment dropdown in Postman → click on the variable → enter the value.

---

## 9. Troubleshooting

| Problem | Solution |
|---|---|
| `Connection refused` on requests | Ensure the Spring Boot app is running on port 5454 (`./mvnw spring-boot:run`) |
| `403 Forbidden` on `/api/**` endpoints | Run **Sign In** or **Sign Up** first to get a JWT token. Check that the `{{jwt_token}}` variable is set in the environment. |
| `401 Unauthorized` | The JWT may have expired (24-hour validity). Run **Sign In** again to get a fresh token. |
| Database connection error on startup | Verify MySQL is running on port 3306, the `wfs` database exists, and `DB_PASSWORD` is set correctly. |
| Email/invitation errors | Ensure `MAIL_USERNAME` and `MAIL_PASSWORD` environment variables are set with valid Gmail App Password credentials. |
| Payment endpoint errors | Ensure Stripe environment variables are configured: `STRIPE_API_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_DEFAULT_PRICE_ID`. |
| `{{variable}}` appears literally in request | Select the **"WolfManagementSystem - Local"** environment from the dropdown in the top-right corner of Postman. |
