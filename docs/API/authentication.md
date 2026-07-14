# Authentication API

**Base URL**

```http
/api/v1/auth
```

---

# 1. Register User

### Endpoint

```http
POST /api/auth/register
```

### Description

Registers a new student account and sends an OTP to the registered college email.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✅ | Full name of the user |
| email | String | ✅ | Verified college email |
| password | String | ✅ | User password |

### Example Request

```json
{
  "name": "xyz",
  "email": "xyz@mitwpu.edu.in",
  "password": "StrongPassword123"
}
```

### Success Response (201)

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|400|Invalid input|
|400|Weak password|
|400|Invalid college email|
|409|Email already registered|

---

# 2. Verify Email

### Endpoint

```http
POST /api/auth/verify-email
```

### Description

Verifies the OTP sent to the user's college email and activates the account.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | ✅ | Registered email |
| otp | String | ✅ | 6-digit OTP |

### Example Request

```json
{
  "email": "xyz@mitwpu.edu.in",
  "otp": "483921"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Email verified successfully."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|400|Invalid OTP|
|400|OTP expired|
|404|User not found|

---

# 3. Resend OTP

### Endpoint

```http
POST /api/auth/resend-otp
```

### Description

Generates and sends a new OTP to the registered email.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | ✅ | Registered email |

### Example Request

```json
{
  "email": "xyz@mitwpu.edu.in"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "OTP sent successfully."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|400|Email already verified|
|404|User not found|

---

# 4. Login

### Endpoint

```http
POST /api/auth/login
```

### Description

Authenticates the user and creates a secure session.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | ✅ | Registered email |
| password | String | ✅ | User password |

### Example Request

```json
{
  "email": "sxt@mitwpu.edu.in",
  "password": "StrongPassword123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "user_id",
    "name": "yzx",
    "username": "yzx21",
    "email": "yzx@mitwpu.edu.in"
  }
}
```

**Note:** A JWT access token is returned as an **HTTP-only cookie**.

### Error Responses

| Status Code | Reason |
|-------------|--------|
|401|Invalid email or password|
|403|Email not verified|
|404|User not found|

---

# 5. Logout

### Endpoint

```http
POST /api/auth/logout
```

### Description

Logs out the current user by clearing the authentication cookie.

### Authentication Required

✅ Yes

### Request Body

None

### Success Response (200)

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|401|Unauthorized|

---

# 6. Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Description

Returns details of the currently authenticated user.

### Authentication Required

✅ Yes

### Success Response (200)

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Vedant Rathod",
    "username": "vedant021",
    "email": "vedant@mitwpu.edu.in",
    "role": "student"
  }
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|401|Unauthorized|

---

# 7. Forgot Password

### Endpoint

```http
POST /api/auth/forgot-password
```

### Description

Sends a password reset OTP to the registered email.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | ✅ | Registered email |

### Example Request

```json
{
  "email": "vedant@mitwpu.edu.in"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Password reset OTP sent."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|404|User not found|

---

# 8. Reset Password

### Endpoint

```http
POST /api/auth/reset-password
```

### Description

Resets the user's password after successful OTP verification.

### Authentication Required

❌ No

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | ✅ | Registered email |
| otp | String | ✅ | Password reset OTP |
| newPassword | String | ✅ | New password |

### Example Request

```json
{
  "email": "xyz@mitwpu.edu.in",
  "otp": "928341",
  "newPassword": "NewStrongPassword123"
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Password updated successfully."
}
```

### Error Responses

| Status Code | Reason |
|-------------|--------|
|400|Invalid OTP|
|400|OTP expired|
|400|Weak password|

---

# Authentication Flow

```text
Register
    │
    ▼
Send OTP
    │
    ▼
Verify Email
    │
    ▼
Account Activated
    │
    ▼
Login
    │
    ▼
JWT + HTTP-only Cookie
    │
    ▼
Protected Routes
    │
    ▼
Logout
```

# Technology

# Authentication Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Runtime | Node.js | Backend runtime environment |
| Framework | Express.js | Build REST APIs |
| Database | MongoDB | Store user authentication data |
| ODM | Mongoose | Object Data Modeling (ODM) for MongoDB |
| Authentication | JWT (JSON Web Token) | Authenticate users |
| Password Hashing | bcrypt | Securely hash user passwords |
| Token Storage | HTTP-only Cookies | Securely store JWT access tokens |
| Email Service | Nodemailer | Send verification and password reset emails |
| OTP Generation | Node.js `crypto` | Generate secure OTPs |
| Cache & Temporary Storage | Redis | Store OTPs, cache authentication data |
| Validation | Zod | Validate incoming request data |
| Rate Limiting | express-rate-limit + rate-limit-redis | Prevent brute-force attacks and API abuse |
| Security Headers | Helmet | Secure HTTP response headers |
| CORS | cors | Restrict cross-origin requests |
| Cookie Parsing | cookie-parser | Parse cookies from incoming requests |
| Environment Variables | dotenv | Manage secrets and configuration |

---

# Authentication Security Stack

## Authentication

- JWT (JSON Web Token)
- HTTP-only Cookies

---

## Password Security

- bcrypt Password Hashing
- Strong Password Validation
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (optional but recommended)

---

## Email Verification

- College Email Validation
- OTP Verification
- Redis OTP Storage
- OTP Expiration (Redis TTL - 5 minutes)
- OTP Resend Cooldown
- Maximum OTP Verification Attempts

---

## Authorization

- Role-Based Access Control (RBAC)
  - Student
  - Faculty
  - Senior Faculty
  - Club Leader
  - College Admin
  - Super Admin
  - view admin

---

## API Protection

- Rate Limiting
- Request Validation (Zod)
- Input Sanitization
- CORS Protection
- Helmet Security Headers

---

## Session Security

- HTTP-only Cookies
- Secure Cookies (Production)
- SameSite Cookie Policy
- JWT Expiration
- Logout Cookie Invalidation

---

## Data Security

- Environment Variables (.env)
- No Plain Text Password Storage
- Secure Secret Management

---

## Redis Security Features

- OTP Storage
- OTP Auto Expiration (TTL)
- Distributed Rate Limiting
- Authentication Cache (Future)
- Session Management (Future)

---

## Logging & Monitoring

- Login Attempt Logging
- Failed Authentication Logging
- Server Error Logging
- Sensitive Data Never Logged
  - Passwords
  - JWT Tokens
  - OTPs

---

# Security Checklist

- ✅ bcrypt Password Hashing
- ✅ JWT Authentication
- ✅ HTTP-only Cookies
- ✅ College Email Verification
- ✅ OTP Verification
- ✅ Redis OTP Storage
- ✅ Redis TTL
- ✅ Rate Limiting
- ✅ Helmet Security Headers
- ✅ CORS Configuration
- ✅ Request Validation
- ✅ Input Sanitization
- ✅ Role-Based Access Control (RBAC)
- ✅ Secure Environment Variables
- ✅ Secure Cookie Configuration
- ✅ Authentication Logging