# Application API Documentation
## Freelance Platform - Application Controller Endpoints

**Base URL:** `http://localhost:3300/api/v1`

---

## 🚀 **OVERVIEW**

The Application Controller manages the complete application lifecycle for freelance projects, from initial submission to project completion. It handles application submissions, status management, project delivery, and client approval processes.

### **Key Features:**
- ✅ Role-based access control (Freelancer/Client/Admin)
- ✅ Content validation and filtering
- ✅ Rate limiting protection (10 applications per 24 hours)
- ✅ Comprehensive error handling
- ✅ Real-time status tracking
- ✅ File attachment support

---

## 📋 **AUTHENTICATION**

All endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔗 **ENDPOINTS**

### 1. **Apply to Project**
Submit an application for a freelance project.

**Endpoint:** `POST /applications/:projectId/apply`  
**Role Required:** `freelancer`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| projectId | string | URL params | Yes | The ID of the project to apply to |

#### **Request Body:**
```json
{
  "proposedBudget": 500.00,
  "expectedDelivery": 7,
  "coverLetter": "I am interested in this project and have 5+ years of experience...",
  "attachments": ["file1.pdf", "file2.png"]
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| proposedBudget | number | Yes | Proposed project budget | Must be > 0 |
| expectedDelivery | number | Yes | Expected delivery time in days | Must be > 0 |
| coverLetter | string | Yes | Application cover letter | Content filtered |
| attachments | array | No | Array of attachment file names | Optional |

#### **Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "project": {
      "_id": "674a1234567890abcdef5678",
      "title": "E-commerce Website Development",
      "budget": 1000,
      "projectStatus": "active",
      "slug": "ecommerce-website-development",
      "client": {
        "_id": "674a1234567890abcdef9012",
        "fullName": "John Smith",
        "email": "john@company.com",
        "avatar": "avatar1.jpg",
        "company": "Tech Solutions Inc"
      }
    },
    "freelancer": {
      "_id": "674a1234567890abcdef3456",
      "fullName": "Jane Developer",
      "email": "jane@email.com",
      "avatar": "avatar2.jpg"
    },
    "proposedBudget": 500,
    "expectedDelivery": 7,
    "coverLetter": "I am interested in this project...",
    "attachments": ["file1.pdf"],
    "status": "pending",
    "appliedAt": "2024-07-20T10:30:00.000Z"
  },
  "message": "Application submitted successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Rate Limiting (429)
{
  "statusCode": 429,
  "message": "Too many applications submitted today. Please try again tomorrow.",
  "success": false
}

// Content Violation (400)
{
  "statusCode": 400,
  "message": "Cover letter contains inappropriate content. Please review and modify your content to ensure it's professional and appropriate.",
  "success": false
}

// Deadline Passed (400)
{
  "statusCode": 400,
  "message": "Application deadline (12/25/2024) has passed",
  "success": false
}

// Already Applied (400)
{
  "statusCode": 400,
  "message": "You have already applied to this project",
  "success": false
}
```

---

### 2. **Edit Application**
Edit a pending application before client review.

**Endpoint:** `PUT /applications/:applicationId/edit`  
**Role Required:** `freelancer`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the application to edit |

#### **Request Body:**
```json
{
  "proposedBudget": 550.00,
  "expectedDelivery": 5,
  "coverLetter": "Updated cover letter with more details...",
  "attachments": ["updated_file.pdf"]
}
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "proposedBudget": 550,
    "expectedDelivery": 5,
    "coverLetter": "Updated cover letter...",
    "attachments": ["updated_file.pdf"],
    "status": "pending",
    "updatedAt": "2024-07-20T11:00:00.000Z"
  },
  "message": "Application updated successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Cannot Edit Non-Pending (400)
{
  "statusCode": 400,
  "message": "Cannot edit application with status: accepted",
  "success": false
}

// Not Owner (403)
{
  "statusCode": 403,
  "message": "You can only edit your own applications",
  "success": false
}
```

---

### 3. **Withdraw Application**
Withdraw a pending application.

**Endpoint:** `PUT /applications/:applicationId/withdraw`  
**Role Required:** `freelancer`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the application to withdraw |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "status": "withdrawn",
    "withdrawnAt": "2024-07-20T12:00:00.000Z"
  },
  "message": "Application withdrawn successfully",
  "success": true
}
```

---

### 4. **Accept Application**
Client accepts a freelancer's application.

**Endpoint:** `PUT /applications/:applicationId/accept`  
**Role Required:** `client`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the application to accept |

#### **Request Body:**
```json
{
  "message": "Great proposal! Let's get started on this project."
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| message | string | No | Message to the freelancer | Content filtered |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "status": "accepted",
    "acceptedAt": "2024-07-20T13:00:00.000Z",
    "clientMessage": "Great proposal! Let's get started...",
    "project": {
      "projectStatus": "assigned"
    }
  },
  "message": "Application accepted successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Not Project Owner (403)
{
  "statusCode": 403,
  "message": "You can only accept applications for your own projects",
  "success": false
}

// Already Assigned (400)
{
  "statusCode": 400,
  "message": "This project is already assigned to another freelancer",
  "success": false
}
```

---

### 5. **Reject Application**
Client rejects a freelancer's application.

**Endpoint:** `PUT /applications/:applicationId/reject`  
**Role Required:** `client`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the application to reject |

#### **Request Body:**
```json
{
  "message": "Thank you for your interest, but we've decided to go with another candidate."
}
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "status": "rejected",
    "rejectedAt": "2024-07-20T14:00:00.000Z",
    "clientMessage": "Thank you for your interest..."
  },
  "message": "Application rejected",
  "success": true
}
```

---

### 6. **Submit Project**
Freelancer submits completed project for client review.

**Endpoint:** `PUT /applications/:applicationId/submit`  
**Role Required:** `freelancer`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the accepted application |

#### **Request Body:**
```json
{
  "deliverables": ["final_website.zip", "documentation.pdf"],
  "message": "Project completed as per requirements. Please review the deliverables."
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| deliverables | array | Yes | Array of deliverable file names | Required |
| message | string | No | Submission message | Content filtered |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "status": "submitted",
    "submittedAt": "2024-07-20T15:00:00.000Z",
    "deliverables": ["final_website.zip", "documentation.pdf"],
    "submissionMessage": "Project completed as per requirements..."
  },
  "message": "Project submitted successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Wrong Status (400)
{
  "statusCode": 400,
  "message": "Can only submit projects with accepted applications",
  "success": false
}

// Missing Deliverables (400)
{
  "statusCode": 400,
  "message": "Deliverables are required for project submission",
  "success": false
}
```

---

### 7. **Approve Completion**
Client approves completed project and provides feedback.

**Endpoint:** `PUT /applications/:applicationId/approve`  
**Role Required:** `client`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| applicationId | string | URL params | Yes | The ID of the submitted application |

#### **Request Body:**
```json
{
  "rating": 5,
  "feedback": "Excellent work! Delivered exactly what was requested on time."
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| rating | number | Yes | Rating from 1-5 | Must be 1-5 |
| feedback | string | Yes | Client feedback | Content filtered |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "status": "completed",
    "completedAt": "2024-07-20T16:00:00.000Z",
    "clientRating": 5,
    "clientFeedback": "Excellent work! Delivered exactly...",
    "project": {
      "projectStatus": "completed"
    }
  },
  "message": "Project completion approved successfully",
  "success": true
}
```

#### **Error Responses:**
```json
// Invalid Rating (400)
{
  "statusCode": 400,
  "message": "Rating must be between 1 and 5",
  "success": false
}

// Wrong Status (400)
{
  "statusCode": 400,
  "message": "Can only approve submitted projects",
  "success": false
}
```

---

### 8. **Get User Applications**
Get all applications submitted by the current freelancer.

**Endpoint:** `GET /applications/my-applications`  
**Role Required:** `freelancer`

#### **Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of applications per page |
| status | string | No | all | Filter by status (pending, accepted, rejected, etc.) |
| sortBy | string | No | appliedAt | Sort field |
| sortOrder | string | No | desc | Sort order (asc, desc) |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "applications": [
      {
        "_id": "674a1234567890abcdef1234",
        "project": {
          "_id": "674a1234567890abcdef5678",
          "title": "E-commerce Website Development",
          "budget": 1000,
          "projectStatus": "active",
          "slug": "ecommerce-website-development"
        },
        "proposedBudget": 500,
        "expectedDelivery": 7,
        "status": "pending",
        "appliedAt": "2024-07-20T10:30:00.000Z"
      }
    ],
    "stats": {
      "pending": 3,
      "accepted": 2,
      "rejected": 1,
      "completed": 5
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 11,
      "totalPages": 2
    }
  },
  "message": "User applications fetched successfully",
  "success": true
}
```

---

### 9. **Get Client Applications**
Get all applications for projects owned by the current client.

**Endpoint:** `GET /applications/client-applications`  
**Role Required:** `client`

#### **Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of applications per page |
| projectId | string | No | - | Filter by specific project |
| status | string | No | all | Filter by status |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "applications": [
      {
        "_id": "674a1234567890abcdef1234",
        "project": {
          "_id": "674a1234567890abcdef5678",
          "title": "E-commerce Website Development"
        },
        "freelancer": {
          "_id": "674a1234567890abcdef3456",
          "fullName": "Jane Developer",
          "email": "jane@email.com",
          "avatar": "avatar2.jpg"
        },
        "proposedBudget": 500,
        "expectedDelivery": 7,
        "status": "pending",
        "appliedAt": "2024-07-20T10:30:00.000Z"
      }
    ],
    "stats": {
      "pending": 8,
      "accepted": 2,
      "rejected": 5
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  },
  "message": "Client applications fetched successfully",
  "success": true
}
```

---

### 10. **Get Project Applications**
Get all applications for a specific project.

**Endpoint:** `GET /applications/project/:projectId`  
**Role Required:** `client` (project owner) or `admin`

#### **Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| projectId | string | URL params | Yes | The ID of the project |

#### **Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of applications per page |
| status | string | No | all | Filter by status |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "applications": [
      {
        "_id": "674a1234567890abcdef1234",
        "freelancer": {
          "_id": "674a1234567890abcdef3456",
          "fullName": "Jane Developer",
          "email": "jane@email.com",
          "avatar": "avatar2.jpg"
        },
        "proposedBudget": 500,
        "expectedDelivery": 7,
        "coverLetter": "I am interested in this project...",
        "status": "pending",
        "appliedAt": "2024-07-20T10:30:00.000Z"
      }
    ],
    "stats": {
      "pending": 5,
      "accepted": 1,
      "rejected": 2
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 8,
      "totalPages": 1
    }
  },
  "message": "Project applications fetched successfully",
  "success": true
}
```

---

## 🔒 **SECURITY FEATURES**

### **Content Validation**
All text inputs are validated for inappropriate content:
- Cover letters
- Client messages
- Submission messages
- Client feedback
- Any user-generated text content

### **Rate Limiting**
- **Freelancers:** Maximum 10 applications per 24-hour period
- **Automatic Reset:** Rate limit resets after 24 hours
- **Error Code:** 429 (Too Many Requests)

### **Role-Based Access Control**
- **Freelancers:** Can apply, edit, withdraw, and submit projects
- **Clients:** Can accept, reject, and approve completions
- **Admins:** Can access all endpoints for monitoring

### **Data Validation**
- Budget values must be positive numbers
- Delivery times must be positive integers
- Ratings must be between 1-5
- Required fields are enforced

---

## ⚠️ **ERROR CODES**

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid data, missing fields, deadline passed |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient role permissions |
| 404 | Not Found | Application or project not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## 📊 **APPLICATION STATUS FLOW**

```
pending → accepted → submitted → completed
    ↓         ↓
 withdrawn  rejected
```

### **Status Descriptions:**
- **pending:** Application submitted, awaiting client review
- **accepted:** Client accepted the application, project assigned
- **rejected:** Client rejected the application
- **withdrawn:** Freelancer withdrew the application
- **submitted:** Freelancer submitted completed project
- **completed:** Client approved and rated the completed project

---

## 🚀 **SAMPLE REQUESTS**

### **cURL Examples:**

#### **Apply to Project:**
```bash
curl -X POST http://localhost:3300/api/v1/applications/674a1234567890abcdef5678/apply \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "proposedBudget": 500,
    "expectedDelivery": 7,
    "coverLetter": "I am very interested in this project and have relevant experience...",
    "attachments": ["portfolio.pdf"]
  }'
```

#### **Accept Application:**
```bash
curl -X PUT http://localhost:3300/api/v1/applications/674a1234567890abcdef1234/accept \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Great proposal! Looking forward to working with you."
  }'
```

#### **Submit Project:**
```bash
curl -X PUT http://localhost:3300/api/v1/applications/674a1234567890abcdef1234/submit \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "deliverables": ["final_website.zip", "documentation.pdf"],
    "message": "Project completed as per all requirements. Please review."
  }'
```

---

## 📝 **NOTES**

### **File Attachments:**
- File uploads are handled separately via multer middleware
- Only file names are stored in the application model
- Actual files are stored in the uploads directory or cloud storage

### **Pagination:**
- Default page size is 10 items
- Maximum page size is 100 items
- Total count included in response for UI pagination

### **Real-time Updates:**
- Consider implementing WebSocket notifications for status changes
- Email notifications can be triggered on status updates

### **Performance Considerations:**
- Database queries use appropriate indexes
- Pagination prevents large data transfers
- Content validation is lightweight and fast

---

## 🔧 **DEVELOPMENT SETUP**

### **Environment Variables:**
```env
PORT=3300
MONGODB_URI=mongodb://localhost:27017/freelance-platform
JWT_SECRET=your-secret-key
```

### **Dependencies:**
- Express.js
- MongoDB/Mongoose
- JWT for authentication
- Content filtering utility
- File upload middleware (multer)

---

**Last Updated:** July 20, 2025  
**API Version:** v1  
**Server Port:** 3300
