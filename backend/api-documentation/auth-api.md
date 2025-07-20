# Authentication API Documentation
## Freelance Platform - Auth Controller Endpoints

**Base URL:** `http://localhost:3300/api/v1/auth`

---

## 🚀 **OVERVIEW**

The Authentication Controller handles user registration, login, logout, token refresh, and user verification for the freelance platform. It provides secure JWT-based authentication with access and refresh token management.

### **Key Features:**
- ✅ Secure JWT-based authentication
- ✅ Role-based user registration (freelancer/client/admin)
- ✅ **Email OTP verification for registration**
- ✅ **OTP-based password reset flow**
- ✅ Access & Refresh token system
- ✅ Remember me functionality
- ✅ Comprehensive input validation
- ✅ Secure cookie management
- ✅ Password hashing with bcrypt

---

## 🔐 **AUTHENTICATION FLOW**

```
Registration → Email/Username & Password → Email OTP → Verify OTP → JWT Tokens → Protected Routes
Login → Email Verification Check → Verify Credentials → Access Token (15min) + Refresh Token (7-30 days)
Token Refresh → New Access Token → Continue Session
Logout → Clear Cookies → End Session
Password Reset → Email OTP → Verify OTP → Reset Token → Reset Password
```

### **Registration Flow with OTP:**
```
1. User submits registration data
2. System creates user account (unverified)
3. 6-digit OTP sent to user's email (expires in 10 minutes)
4. User enters OTP to verify email
5. Email verified, registration completed
6. User can now log in
```

### **Password Reset Flow with OTP:**
```
1. User requests password reset with email
2. System generates 6-digit OTP
3. OTP sent via email (expires in 10 minutes)
4. User enters OTP to verify identity
5. System provides temporary reset token
6. User resets password with token
7. All existing sessions invalidated for security
```

---

## 🔗 **ENDPOINTS**

### 1. **Check Username Availability**
Check if a username is available for registration in real-time.

**Endpoint:** `GET /api/v1/user/check-username/:username`  
**Authentication:** None required (Public endpoint)

#### **URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Username to check (3-20 chars, letters, numbers, underscore only) |

#### **Response (200) - Available:**
```json
{
  "statusCode": 200,
  "data": {
    "username": "john_dev",
    "available": true
  },
  "message": "Username is available",
  "success": true
}
```

#### **Response (200) - Not Available:**
```json
{
  "statusCode": 200,
  "data": {
    "username": "john",
    "available": false
  },
  "message": "Username is already taken",
  "success": true
}
```

#### **Response (200) - Invalid Format:**
```json
{
  "statusCode": 200,
  "data": {
    "username": "ab",
    "available": false,
    "reason": "Username must be 3-20 characters and contain only letters, numbers, and underscores"
  },
  "message": "Username format invalid",
  "success": true
}
```

#### **Username Rules:**
- 🔸 **Length:** 3-20 characters
- 🔸 **Characters:** Letters (a-z, A-Z), numbers (0-9), underscores (_)
- 🔸 **Case:** Case-insensitive (stored as lowercase)
- 🔸 **Uniqueness:** Must be unique across all users

#### **Example Usage:**
```javascript
// Real-time check during registration
const checkUsername = async (username) => {
  const response = await fetch(`/api/v1/user/check-username/${username}`);
  const result = await response.json();
  return result.data.available;
};
```

---

### 2. **User Registration**
Register a new user account and send email OTP for verification.

**Endpoint:** `POST /api/v1/user/register`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com",
  "password": "SecurePass123!",
  "userName": "johndeveloper",
  "fullName": "John Developer",
  "role": "freelancer"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format, unique |
| password | string | Yes | User's password | Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |
| userName | string | Yes | Unique username | 3-20 chars, unique |
| fullName | string | Yes | User's full name | Required |
| role | string | Yes | User role | One of: freelancer, client, admin |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "john.developer@email.com",
    "message": "Registration successful! Please check your email for OTP verification.",
    "previewUrl": "https://ethereal.email/message/xyz..." // Development only
  },
  "message": "Registration successful! Please verify your email with the OTP sent to your email address.",
  "success": true
}
```

#### **Error Responses:**
```json
// Validation Error (400)
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "success": false
}

// Duplicate User (400)
{
  "statusCode": 400,
  "message": "User with this email already exists",
  "success": false
}
```

---

### 3. **Email OTP Verification**
Verify the email OTP sent during registration to activate the account.

**Endpoint:** `POST /api/v1/user/verify-email`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com",
  "otp": "123456"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format |
| otp | string | Yes | 6-digit OTP code | Exactly 6 digits |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "email": "john.developer@email.com",
    "userName": "johndeveloper",
    "fullName": "John Developer",
    "role": "freelancer",
    "profileImage": "",
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "isProfileVerified": false,
    "totalEarnings": 0,
    "successRate": 0,
    "averageRating": 0,
    "reviewCount": 0,
    "createdAt": "2024-07-20T10:30:00.000Z",
    "updatedAt": "2024-07-20T10:30:00.000Z"
  },
  "message": "Email verified successfully! You can now login.",
  "success": true
}
```

### 4. **Resend Email OTP**
Resend OTP for email verification if the previous OTP expired or was not received.

**Endpoint:** `POST /api/v1/user/resend-otp`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "john.developer@email.com",
    "message": "New OTP sent successfully!",
    "previewUrl": "https://ethereal.email/message/xyz..." // Development only
  },
  "message": "New OTP sent to your email address.",
  "success": true
}
```

### 5. **User Login**
Authenticate user with email and password. Email must be verified before login.

**Endpoint:** `POST /api/v1/user/login`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com",
  "password": "SecurePass123!"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format |
| password | string | Yes | User's password | Required |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "674a1234567890abcdef1234",
      "email": "john.developer@email.com",
      "userName": "johndeveloper",
      "fullName": "John Developer",
      "role": "freelancer",
      "profileImage": "",
      "isEmailVerified": true,
      "isPhoneVerified": false,
      "isProfileVerified": false,
      "totalEarnings": 0,
      "successRate": 0,
      "averageRating": 0,
      "reviewCount": 0,
      "createdAt": "2024-07-20T10:30:00.000Z",
      "updatedAt": "2024-07-20T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Email not verified (400)
{
  "statusCode": 400,
  "message": "Please verify your email before logging in",
  "success": false
}

// User Not Found (400)
{
  "statusCode": 400,
  "message": "User not found",
  "success": false
}

// Invalid Password (400)
{
  "statusCode": 400,
  "message": "Invalid Password",
  "success": false
}
```

---

### 6. **Forgot Password**
Send OTP to user's email for password reset verification.

**Endpoint:** `POST /api/v1/user/forgot-password`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "email": "john.developer@email.com",
    "message": "Password reset OTP sent successfully!",
    "previewUrl": "https://ethereal.email/message/xyz..." // Development only
  },
  "message": "Password reset OTP sent to your email address.",
  "success": true
}
```

### 7. **Verify Password Reset OTP**
Verify the OTP sent for password reset and receive reset token.

**Endpoint:** `POST /api/v1/user/verify-reset-otp`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com",
  "otp": "123456"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| email | string | Yes | User's email address | Valid email format |
| otp | string | Yes | 6-digit OTP code | Exactly 6 digits |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "message": "OTP verified successfully! Use the reset token to set new password."
  },
  "message": "OTP verified successfully. You can now reset your password.",
  "success": true
}
```

### 8. **Reset Password**
Reset user password using the reset token received from OTP verification.

**Endpoint:** `POST /api/v1/user/reset-password`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewSecurePass123!"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| resetToken | string | Yes | JWT reset token from OTP verification | Valid JWT token |
| newPassword | string | Yes | New password | Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Password reset successful"
  },
  "message": "Password has been reset successfully",
  "success": true
}
```

---

### 9. **Verify User**
Verify current user's authentication status and get user data.

**Endpoint:** `GET /api/v1/user/verifyUser`  
**Authentication:** Required (Access Token)

#### **Headers:**
```
Cookie: accessToken=<jwt-access-token>
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "674a1234567890abcdef1234",
      "email": "john.developer@email.com",
      "userName": "johndeveloper",
      "fullName": "John Developer",
      "role": "freelancer",
      "profileImage": "",
      "bio": "",
      "skills": ["JavaScript", "React", "Node.js"],
      "hourlyRate": 50,
      "availability": "available",
      "totalEarnings": 1500,
      "successRate": 95,
      "averageRating": 4.8,
      "reviewCount": 12,
      "isEmailVerified": true,
      "isPhoneVerified": false,
      "isProfileVerified": true,
      "createdAt": "2024-07-20T10:30:00.000Z",
      "updatedAt": "2024-07-20T15:45:00.000Z"
    }
  },
  "success": true
}
```

#### **Error Responses:**
```json
// No Token (401)
{
  "statusCode": 401,
  "message": "No token found",
  "success": false
}

// Token Expired (401)
{
  "statusCode": 401,
  "message": "Token expired",
  "success": false
}

// User Not Found (401)
{
  "statusCode": 401,
  "message": "User Not found",
  "success": false
}
```

---

### 4. **Refresh Token**
Generate a new access token using refresh token.

**Endpoint:** `GET /api/v1/user/refreshtoken`  
**Authentication:** Required (Refresh Token)

#### **Headers:**
```
Cookie: refreshToken=<jwt-refresh-token>
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "email": "john.developer@email.com",
    "userName": "johndeveloper",
    "fullName": "John Developer",
    "role": "freelancer",
    "profileImage": "",
    "bio": "",
    "skills": ["JavaScript", "React", "Node.js"],
    "hourlyRate": 50,
    "availability": "available",
    "totalEarnings": 1500,
    "successRate": 95,
    "averageRating": 4.8,
    "reviewCount": 12,
    "isEmailVerified": true,
    "isPhoneVerified": false,
    "isProfileVerified": true,
    "createdAt": "2024-07-20T10:30:00.000Z",
    "updatedAt": "2024-07-20T15:45:00.000Z"
  },
  "message": "token refreshed successfully",
  "success": true
}
```

#### **Cookies Set:**
- **New Access Token:** `accessToken` (15 minutes, httpOnly, secure, sameSite: strict)

#### **Error Responses:**
```json
// No Refresh Token (401)
{
  "statusCode": 401,
  "message": "No refresh token",
  "success": false
}

// Invalid Refresh Token (401)
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "success": false
}

// User Not Found (401)
{
  "statusCode": 401,
  "message": "User not found",
  "success": false
}
```

---

### 5. **Logout User**
Clear authentication cookies and end user session.

**Endpoint:** `GET /api/v1/user/logout`  
**Authentication:** None required

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "logout successfully",
  "success": true
}
```

#### **Cookies Cleared:**
- `accessToken` cookie removed
- `refreshToken` cookie removed

---

### 6. **Forgot Password**
Request a password reset link via email.

**Endpoint:** `POST /api/v1/user/forgot-password`  
**Authentication:** None required

#### **Request Body:**
```json
{
  "email": "john.developer@email.com"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Email address associated with the account |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Password reset email sent successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// User Not Found (404)
{
  "statusCode": 404,
  "message": "User with this email does not exist",
  "success": false
}

// Email Required (400)
{
  "statusCode": 400,
  "message": "Email is required",
  "success": false
}

// Email Service Error (500)
{
  "statusCode": 500,
  "message": "Error sending email. Please try again later.",
  "success": false
}
```

---

### 7. **Reset Password**
Reset password using the token received via email.

**Endpoint:** `POST /api/v1/user/reset-password/:token`  
**Authentication:** None required

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| token | string | URL params | Yes | Password reset token from email |

#### **Request Body:**
```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| password | string | Yes | New password | Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char |
| confirmPassword | string | Yes | Confirm new password | Must match password |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "email": "john.developer@email.com",
    "userName": "johndeveloper",
    "fullName": "John Developer",
    "role": "freelancer",
    "profileImage": "",
    "bio": "",
    "skills": [],
    "hourlyRate": 0,
    "availability": "available",
    "totalEarnings": 0,
    "successRate": 0,
    "averageRating": 0,
    "reviewCount": 0,
    "isEmailVerified": false,
    "isPhoneVerified": false,
    "isProfileVerified": false,
    "createdAt": "2024-07-20T10:30:00.000Z",
    "updatedAt": "2024-07-20T15:45:00.000Z"
  },
  "message": "Password reset successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Invalid Token (400)
{
  "statusCode": 400,
  "message": "Invalid or expired reset token",
  "success": false
}

// Password Mismatch (400)
{
  "statusCode": 400,
  "message": "Passwords do not match",
  "success": false
}

// Validation Error (400)
{
  "statusCode": 400,
  "message": "Validation failed",
  "data": [
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    }
  ],
  "success": false
}
```

---

## 🔒 **SECURITY FEATURES**

### **Password Security**
- **Hashing:** bcrypt with salt rounds (10)
- **Validation:** Minimum requirements enforced
  - At least 6 characters
  - 1 uppercase letter
  - 1 lowercase letter  
  - 1 number
  - 1 special character (@$!%*?&)

### **JWT Token Security**
- **Access Token:** Short-lived (15 minutes)
- **Refresh Token:** Longer-lived (7 days / 30 days with remember)
- **Secure Storage:** httpOnly, secure, sameSite: strict cookies
- **Token Payload:** Contains essential user info (ID, email, username, role)

### **Input Validation**
- **Email:** Format validation, uniqueness check
- **Username:** Length validation (3-20 chars), uniqueness check
- **Role:** Restricted to predefined values
- **Password:** Complex validation rules

### **Password Reset Security**
- **Token Generation:** JWT-based with short expiration (10 minutes)
- **Token Signing:** Uses dedicated RESET_TOKEN_SECRET or fallback to ACCESS_TOKEN_SECRET
- **Token Verification:** Standard JWT verification with payload validation
- **Session Invalidation:** All refresh tokens cleared on password reset
- **Single Use:** Reset tokens invalidated after successful password change

### **Cookie Security**
```javascript
{
  httpOnly: true,    // Prevents XSS attacks
  secure: true,      // HTTPS only
  sameSite: "strict" // CSRF protection
}
```

---

## 📊 **USER ROLES & PERMISSIONS**

### **Role Types:**
1. **freelancer** - Can apply to projects, create gigs, earn money
2. **client** - Can post projects, hire freelancers, pay for services
3. **admin** - Full system access, user management, platform oversight

### **Role-Based Data:**
- **Freelancers:** skills, hourlyRate, availability, portfolio, experience
- **Clients:** company info, account type, project management
- **Admins:** All system access and management capabilities

---

## ⚠️ **ERROR CODES**

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Validation errors, user not found, invalid credentials, invalid/expired OTP |
| 401 | Unauthorized | Missing/invalid/expired tokens |
| 403 | Forbidden | Insufficient permissions, email not verified |
| 500 | Internal Server Error | Database errors, server issues, email service errors |

### **OTP-Specific Error Messages:**
| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Invalid OTP" | Wrong OTP entered | Check email and enter correct 6-digit OTP |
| "OTP has expired" | OTP older than 10 minutes | Request new OTP using resend endpoint |
| "No OTP found for this email" | No OTP generated or already used | Generate new OTP |
| "Please verify your email before logging in" | Trying to login without email verification | Complete email OTP verification first |

---

## 🚀 **SAMPLE REQUESTS**

### **cURL Examples:**

#### **Register User:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@email.com",
    "password": "SecurePass123!",
    "userName": "johndeveloper",
    "fullName": "John Developer",
    "role": "freelancer"
  }'
```

#### **Verify Email OTP:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@email.com",
    "otp": "123456"
  }'
```

#### **Resend Email OTP:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@email.com"
  }'
```

#### **Login User:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "john.developer@email.com",
    "password": "SecurePass123!"
  }'
```

#### **Verify User:**
```bash
curl -X GET http://localhost:3300/api/v1/auth/verifyUser \
  -b cookies.txt
```

#### **Refresh Token:**
```bash
curl -X GET http://localhost:3300/api/v1/auth/refreshtoken \
  -b cookies.txt \
  -c cookies.txt
```

#### **Logout:**
```bash
curl -X GET http://localhost:3300/api/v1/auth/logout \
  -b cookies.txt
```

#### **Forgot Password:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@email.com"
  }'
```

#### **Verify Password Reset OTP:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/verify-reset-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.developer@email.com",
    "otp": "123456"
  }'
```

#### **Reset Password:**
```bash
curl -X POST http://localhost:3300/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "newPassword": "NewSecurePass123!"
  }'
```

---

## 🛠️ **JAVASCRIPT/FRONTEND EXAMPLES**

### **Registration with Email OTP:**
```javascript
const registerUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Registration successful:', result.data);
      // Show OTP verification form
      showOTPVerificationForm(userData.email);
    } else {
      console.error('Registration failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
registerUser({
  email: "john.developer@email.com",
  password: "SecurePass123!",
  userName: "johndeveloper",
  fullName: "John Developer",
  role: "freelancer"
});
```

### **Email OTP Verification:**
```javascript
const verifyEmailOTP = async (email, otp) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Email verified successfully:', result.data);
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('OTP verification failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### **Resend Email OTP:**
```javascript
const resendOTP = async (email) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/resend-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('New OTP sent:', result.message);
      alert('New OTP sent to your email!');
    } else {
      console.error('Resend OTP failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### **Login:**
```javascript
const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(credentials)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Login successful:', result.data);
      // Store user data in state/context
      // Redirect to dashboard
    } else {
      console.error('Login failed:', result.message);
      if (result.message === 'Please verify your email before logging in') {
        // Show email verification prompt
        showEmailVerificationPrompt(credentials.email);
      }
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
loginUser({
  email: "john.developer@email.com",
  password: "SecurePass123!"
});
```

### **Verify User (for protected routes):**
```javascript
const verifyUser = async () => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/verifyUser', {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data.user;
    } else {
      // User not authenticated, redirect to login
      throw new Error('User not authenticated');
    }
  } catch (error) {
    console.error('Verification failed:', error);
    // Redirect to login page
    window.location.href = '/login';
  }
};

// Usage in React/Vue component
useEffect(() => {
  verifyUser().then(user => {
    setCurrentUser(user);
  });
}, []);
```

### **Logout:**
```javascript
const logoutUser = async () => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/logout', {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Logout successful');
      // Clear local state
      // Redirect to login/home
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

### **Forgot Password with OTP:**
```javascript
const forgotPassword = async (email) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Password reset OTP sent:', result.message);
      // Show OTP verification form for password reset
      showPasswordResetOTPForm(email);
    } else {
      console.error('Forgot password failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### **Verify Password Reset OTP:**
```javascript
const verifyPasswordResetOTP = async (email, otp) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/verify-reset-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Reset OTP verified:', result.data);
      // Store reset token and show new password form
      const resetToken = result.data.resetToken;
      showNewPasswordForm(resetToken);
    } else {
      console.error('OTP verification failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

### **Reset Password:**
```javascript
const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await fetch('http://localhost:3300/api/v1/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ resetToken, newPassword })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Password reset successful:', result.message);
      alert('Password reset successfully! Please login with your new password.');
      // Redirect to login page
      window.location.href = '/login';
    } else {
      console.error('Password reset failed:', result.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};
```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Required Environment Variables:**
```env
# Server Configuration
PORT=3300

# JWT Configuration
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
RESET_TOKEN_SECRET=your-super-secret-reset-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
REMEMBER_REFRESH_TOKEN_EXPIRY=30d

# Cookie Names
ACCESS_TOKEN_NAME=accessToken
REFRESH_TOKEN_NAME=refreshToken

# Frontend URL for password reset
FRONTEND_URL=http://localhost:3000

# Email Configuration (for production)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@llmbeing.com

# Database
MONGODB_URI=mongodb://localhost:27017/freelance-platform
```

---

## 📝 **VALIDATION RULES**

### **Email Validation:**
- Must be valid email format
- Must be unique in database
- Converted to lowercase
- Trimmed of whitespace

### **Password Validation:**
- Minimum 6 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)
- At least 1 special character (@$!%*?&)

### **Username Validation:**
- 3-20 characters long
- Must be unique in database
- Converted to lowercase
- Trimmed of whitespace

### **Role Validation:**
- Must be one of: 'freelancer', 'client', 'admin'
- Case sensitive

---

## 🔄 **TOKEN LIFECYCLE**

### **Access Token:**
- **Lifespan:** 15 minutes
- **Purpose:** API access authorization
- **Storage:** httpOnly cookie
- **Contains:** User ID, email, username, fullName, role

### **Refresh Token:**
- **Lifespan:** 7 days (30 days with remember)
- **Purpose:** Generate new access tokens
- **Storage:** httpOnly cookie + database
- **Contains:** User ID only

### **Refresh Flow:**
1. Access token expires (15 min)
2. Frontend makes API call
3. Server responds with 401
4. Frontend calls refresh endpoint
5. New access token generated
6. Original API call retried

---

## 🚀 **DEPLOYMENT CONSIDERATIONS**

### **Production Security:**
- Use HTTPS in production (secure: true)
- Set strong JWT secrets (minimum 32 characters)
- Configure proper CORS settings
- Implement rate limiting on auth endpoints
- Add request logging and monitoring

### **Cookie Configuration for Production:**
```javascript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  domain: process.env.COOKIE_DOMAIN || 'localhost'
}
```

---

## 🎯 **COMPLETE INTEGRATION EXAMPLE**

### **React Component Example with OTP Flow:**
```javascript
import React, { useState } from 'react';

const AuthComponent = () => {
  const [step, setStep] = useState('register'); // register, verify-email, login, forgot-password, verify-reset, reset-password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleRegister = async (userData) => {
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setEmail(userData.email);
        setStep('verify-email');
        alert('Registration successful! Check your email for OTP.');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setStep('login');
        alert('Email verified! You can now login.');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Verification error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // ... Similar functions for forgot password, verify reset OTP, and reset password

  return (
    <div>
      {step === 'register' && (
        <RegisterForm onSubmit={handleRegister} />
      )}
      {step === 'verify-email' && (
        <OTPVerificationForm 
          email={email} 
          otp={otp} 
          setOtp={setOtp}
          onVerify={handleVerifyEmail}
        />
      )}
      {step === 'login' && (
        <LoginForm 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
};
```

---

## 📈 **PERFORMANCE NOTES**

### **Database Queries:**
- User lookup by email/username uses indexed fields
- Password comparison is optimized with bcrypt
- JWT generation/verification is lightweight

### **Security vs Performance:**
- bcrypt rounds set to 10 (good balance)
- JWT tokens contain minimal payload
- Refresh tokens stored in database for revocation capability

---

**Last Updated:** July 20, 2025  
**API Version:** v1  
**Server Port:** 3300
