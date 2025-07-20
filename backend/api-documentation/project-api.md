# 📋 **PROJECT API DOCUMENTATION**

> **Base URL:** `http://localhost:3300/api/v1/projects`  
> **Version:** v1  
> **Last Updated:** July 21, 2025

---

## 📖 **TABLE OF CONTENTS**

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Error Codes](#error-codes)
5. [Sample Requests](#sample-requests)
6. [JavaScript Examples](#javascript-examples)
7. [Environment Variables](#environment-variables)

---

## 🔍 **OVERVIEW**

The Project API handles core project operations including creation, updates, deletion, and retrieval. This API follows RESTful principles and supports advanced filtering, sorting, and pagination.

### **Key Features:**
- ✅ **Project CRUD operations** (Create, Read, Update, Delete)
- ✅ **Advanced filtering & search** (by skills, category, budget, location)
- ✅ **Multiple sorting options** (newest, budget, popularity, trending)
- ✅ **Pagination support** for large datasets
- ✅ **Role-based access control** (Client vs Freelancer permissions)
- ✅ **Project status management** (draft, active, in_progress, completed, cancelled, paused)
- ✅ **Trending & popular projects** analytics
- ✅ **Slug-based and ID-based** project access
- 🔗 **Separated interaction system** (like/dislike/save handled by dedicated controllers)

---

## 🔐 **AUTHENTICATION**

Most endpoints require authentication. Include the access token in cookies:

```
Cookie: accessToken=<jwt-access-token>
```

### **Role Permissions:**
- **Clients:** Can create, update, delete their own projects
- **Freelancers:** Can view and search all active projects  
- **Public:** Can view trending and popular projects (limited access)

### **Note on Project Interactions:**
Project interactions (like, dislike, save) are handled by separate API controllers:
- **Like Projects API:** `/api/v1/liked-projects` 
- **Dislike Projects API:** `/api/v1/disliked-projects`
- **Saved Projects API:** `/api/v1/saved-projects`

This ensures clean separation of concerns and modular architecture.

---

## 📚 **API ENDPOINTS**

### 1. **Create Project**
Create a new project (Client only).

**Endpoint:** `POST /projects`  
**Authentication:** Required (Client role)

#### **Request Body:**
```json
{
  "title": "AI Chatbot Development for E-commerce",
  "description": "Need an AI-powered chatbot to handle customer inquiries and support for our e-commerce platform. The bot should integrate with our existing systems and provide 24/7 customer support.",
  "projectCategory": "ai_chatbots",
  "skillsRequired": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing"],
  "experienceLevel": "intermediate",
  "projectType": "one_time",
  "budget": {
    "min": 2000,
    "max": 5000,
    "isNegotiable": true
  },
  "currency": "USD",
  "timeline": {
    "estimatedDuration": {
      "value": 6,
      "unit": "weeks"
    },
    "startDate": "2025-08-01T00:00:00.000Z",
    "endDate": "2025-09-15T00:00:00.000Z",
    "isFlexible": true
  },
  "location": {
    "type": "remote",
    "country": "United States",
    "city": "New York"
  },
  "applicationSettings": {
    "maxProposals": 25,
    "autoAcceptProposals": false,
    "allowInvitations": true,
    "screeningQuestions": [
      {
        "question": "How many AI chatbots have you developed?",
        "required": true
      },
      {
        "question": "Do you have experience with e-commerce integrations?",
        "required": true
      }
    ]
  }
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Project title (5-100 chars) |
| description | string | Yes | Detailed description (10-5000 chars) |
| projectCategory | string | Yes | One of predefined categories |
| skillsRequired | array | Yes | Required skills |
| experienceLevel | string | Yes | entry, intermediate, expert |
| projectType | string | Yes | one_time, hourly, ongoing |
| budget | object | Yes | Budget information |
| currency | string | No | USD, EUR, INR, GBP, CAD, AUD |
| timeline | object | No | Project timeline |
| location | object | No | Location requirements |
| applicationSettings | object | No | Application settings |

#### **Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI Chatbot Development for E-commerce",
    "description": "Need an AI-powered chatbot to handle customer inquiries...",
    "projectCategory": "ai_chatbots",
    "skillsRequired": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing"],
    "experienceLevel": "intermediate",
    "projectType": "one_time",
    "projectStatus": "draft",
    "budget": {
      "min": 2000,
      "max": 5000,
      "isNegotiable": true
    },
    "currency": "USD",
    "client": "674a1234567890abcdef5678",
    "stats": {
      "viewCount": 0,
      "proposalCount": 0,
      "likeCount": 0,
      "dislikeCount": 0
    },
    "isActive": true,
    "slug": "ai-chatbot-development-for-e-commerce-1721123456789",
    "createdAt": "2025-07-21T10:30:00.000Z",
    "updatedAt": "2025-07-21T10:30:00.000Z"
  },
  "message": "Project created successfully",
  "success": true
}
```

---

### 2. **Update Project**
Update an existing project (Client only - own projects).

**Endpoint:** `PUT /projects/:projectId`  
**Authentication:** Required (Client role, project owner)

#### **Request Body:**
```json
{
  "title": "Updated AI Chatbot Development",
  "budget": {
    "min": 2500,
    "max": 6000,
    "isNegotiable": false
  },
  "skillsRequired": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing", "React"]
}
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "Updated AI Chatbot Development",
    "budget": {
      "min": 2500,
      "max": 6000,
      "isNegotiable": false
    },
    "client": {
      "_id": "674a1234567890abcdef5678",
      "fullName": "John Smith",
      "email": "john@company.com",
      "avatar": ""
    },
    "updatedAt": "2025-07-21T11:45:00.000Z"
  },
  "message": "Project updated successfully",
  "success": true
}
```

---

### 3. **Delete Project**
Soft delete a project (Client only - own projects).

**Endpoint:** `DELETE /projects/:projectId`  
**Authentication:** Required (Client role, project owner)

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Project deleted successfully",
  "success": true
}
```

---

### 4. **Get All Projects**
Get all active projects with advanced filtering and pagination.

**Endpoint:** `GET /projects`  
**Authentication:** Optional

#### **Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | number | Page number (default: 1) | `?page=2` |
| limit | number | Items per page (default: 10) | `?limit=20` |
| search | string | Text search in title/description | `?search=chatbot` |
| categories | string | Comma-separated categories | `?categories=ai_chatbots,api_integration` |
| skills | string | Comma-separated skills | `?skills=JavaScript,Python` |
| experienceLevel | string | Experience level filter | `?experienceLevel=intermediate` |
| projectType | string | Project type filter | `?projectType=one_time` |
| budgetMin | number | Minimum budget | `?budgetMin=1000` |
| budgetMax | number | Maximum budget | `?budgetMax=5000` |
| location | string | Location type | `?location=remote` |
| sortBy | string | Sort option | `?sortBy=newest` |

#### **Sort Options:**
- `newest` - Most recent projects (default)
- `oldest` - Oldest projects first
- `budget-high` - Highest budget first
- `budget-low` - Lowest budget first
- `popular` - Most liked and viewed
- `trending` - Trending based on recent activity

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "total": 156,
    "page": 1,
    "totalPages": 16,
    "projects": [
      {
        "_id": "674a1234567890abcdef1234",
        "title": "AI Chatbot Development for E-commerce",
        "description": "Need an AI-powered chatbot...",
        "projectCategory": "ai_chatbots",
        "skillsRequired": ["JavaScript", "Python", "AI/ML"],
        "experienceLevel": "intermediate",
        "projectType": "one_time",
        "budget": {
          "min": 2000,
          "max": 5000
        },
        "currency": "USD",
        "client": {
          "_id": "674a1234567890abcdef5678",
          "fullName": "John Smith",
          "email": "john@company.com",
          "avatar": "",
          "company": "TechCorp Inc."
        },
        "stats": {
          "viewCount": 45,
          "proposalCount": 8,
          "likeCount": 12,
          "dislikeCount": 1
        },
        "createdAt": "2025-07-21T10:30:00.000Z",
        "slug": "ai-chatbot-development-for-e-commerce-1721123456789"
      }
    ]
  },
  "message": "Projects fetched successfully",
  "success": true
}
```

---

### 5. **Get Project Details**
Get detailed information about a specific project.

**Endpoint:** `GET /projects/:identifier`  
**Authentication:** Optional

**Note:** `identifier` can be either project ID or slug.

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI Chatbot Development for E-commerce",
    "description": "Need an AI-powered chatbot to handle customer inquiries...",
    "projectCategory": "ai_chatbots",
    "skillsRequired": ["JavaScript", "Python", "Node.js", "AI/ML"],
    "experienceLevel": "intermediate",
    "projectType": "one_time",
    "projectStatus": "active",
    "budget": {
      "min": 2000,
      "max": 5000,
      "isNegotiable": true
    },
    "currency": "USD",
    "timeline": {
      "estimatedDuration": {
        "value": 6,
        "unit": "weeks"
      },
      "startDate": "2025-08-01T00:00:00.000Z",
      "endDate": "2025-09-15T00:00:00.000Z",
      "isFlexible": true
    },
    "location": {
      "type": "remote",
      "country": "United States",
      "city": "New York"
    },
    "client": {
      "_id": "674a1234567890abcdef5678",
      "fullName": "John Smith",
      "email": "john@company.com",
      "avatar": "",
      "company": "TechCorp Inc.",
      "location": "New York, USA",
      "createdAt": "2024-06-15T09:20:00.000Z"
    },
    "assignedFreelancer": null,
    "stats": {
      "viewCount": 46,
      "proposalCount": 8,
      "likeCount": 12,
      "dislikeCount": 1
    },
    "applicationSettings": {
      "maxProposals": 25,
      "autoAcceptProposals": false,
      "allowInvitations": true,
      "screeningQuestions": [
        {
          "question": "How many AI chatbots have you developed?",
          "required": true
        }
      ]
    },
    "slug": "ai-chatbot-development-for-e-commerce-1721123456789",
    "createdAt": "2025-07-21T10:30:00.000Z",
    "updatedAt": "2025-07-21T10:30:00.000Z"
  },
  "message": "Project details fetched successfully",
  "success": true
}
```

---

### 6. **Get Own Projects**
Get client's own projects with status filtering.

**Endpoint:** `GET /projects/own`  
**Authentication:** Required (Client role)

#### **Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by project status | `?status=active` |
| page | number | Page number | `?page=1` |
| limit | number | Items per page | `?limit=10` |

#### **Project Status Options:**
- `draft` - Draft projects
- `active` - Active projects accepting proposals
- `in_progress` - Projects in progress
- `completed` - Completed projects
- `cancelled` - Cancelled projects
- `paused` - Paused projects

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "total": 12,
    "page": 1,
    "totalPages": 2,
    "projects": [
      {
        "_id": "674a1234567890abcdef1234",
        "title": "AI Chatbot Development",
        "projectStatus": "active",
        "budget": {
          "min": 2000,
          "max": 5000
        },
        "stats": {
          "viewCount": 46,
          "proposalCount": 8
        },
        "createdAt": "2025-07-21T10:30:00.000Z"
      }
    ]
  },
  "message": "Your projects fetched successfully",
  "success": true
}
```

---

### 7. **Update Project Status**
Update the status of a project.

**Endpoint:** `PUT /projects/:projectId/status`  
**Authentication:** Required (Client role, project owner)

#### **Request Body:**
```json
{
  "status": "active"
}
```

#### **Allowed Status Values:**
- `draft` - Project is in draft mode
- `active` - Project is active and accepting proposals
- `in_progress` - Project is assigned and in progress
- `completed` - Project is completed
- `cancelled` - Project is cancelled
- `paused` - Project is temporarily paused

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI Chatbot Development",
    "projectStatus": "active",
    "updatedAt": "2025-07-21T12:00:00.000Z"
  },
  "message": "Project status updated successfully",
  "success": true
}
```

---

### 8. **Get Trending Projects**
Get trending projects based on recent activity.

**Endpoint:** `GET /projects/trending`  
**Authentication:** Optional

#### **Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| days | number | Number of days to analyze | 7 |
| limit | number | Number of projects to return | 10 |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "674a1234567890abcdef1234",
      "title": "AI Chatbot Development",
      "projectCategory": "ai_chatbots",
      "budget": {
        "min": 2000,
        "max": 5000
      },
      "stats": {
        "viewCount": 89,
        "proposalCount": 15,
        "likeCount": 23
      },
      "trendingScore": 156.5,
      "createdAt": "2025-07-21T10:30:00.000Z"
    }
  ],
  "message": "Trending projects fetched successfully",
  "success": true
}
```

---

### 9. **Get Most Liked Projects**
Get projects with the highest number of likes.

**Endpoint:** `GET /projects/most-liked`  
**Authentication:** Optional

#### **Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| limit | number | Number of projects to return | 10 |

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "674a1234567890abcdef1234",
      "title": "AI Chatbot Development",
      "projectCategory": "ai_chatbots",
      "client": {
        "_id": "674a1234567890abcdef5678",
        "fullName": "John Smith",
        "email": "john@company.com",
        "avatar": "",
        "company": "TechCorp Inc."
      },
      "stats": {
        "likeCount": 47,
        "viewCount": 156
      },
      "createdAt": "2025-07-21T10:30:00.000Z"
    }
  ],
  "message": "Most liked projects fetched successfully",
  "success": true
}
```

---

## 🔗 **RELATED APIs**

### **Project Interaction APIs:**
The following interactions with projects are handled by separate dedicated APIs:

- **📍 Like Projects API:** `http://localhost:3300/api/v1/liked-projects`
  - `POST /liked-projects/:projectId` - Toggle like on project
  - `GET /liked-projects/my` - Get user's liked projects
  
- **👎 Dislike Projects API:** `http://localhost:3300/api/v1/disliked-projects`  
  - `POST /disliked-projects/:projectId` - Toggle dislike on project
  - `GET /disliked-projects/my` - Get user's disliked projects
  
- **💾 Saved Projects API:** `http://localhost:3300/api/v1/saved-projects`
  - `POST /saved-projects/:projectId` - Toggle save on project  
  - `GET /saved-projects/my` - Get user's saved projects

This separation ensures clean architecture and allows independent scaling of interaction features.

---

## ⚠️ **ERROR CODES**

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid data, validation errors |
| 401 | Unauthorized | Missing or invalid access token |
| 403 | Forbidden | Insufficient permissions, not project owner |
| 404 | Not Found | Project not found |
| 500 | Internal Server Error | Database errors, server issues |

### **Common Error Messages:**
| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Only clients can create projects" | Non-client trying to create project | Login as client |
| "Project not found" | Invalid project ID/slug | Check project ID/slug |
| "You can only update your own projects" | Trying to update someone else's project | Only update own projects |
| "Cannot update completed or cancelled projects" | Trying to update finished project | Only update active projects |
| "Invalid status" | Invalid project status value | Use allowed status values |

---

## 🚀 **SAMPLE REQUESTS**

### **cURL Examples:**

#### **Create Project:**
```bash
curl -X POST http://localhost:3300/api/v1/projects \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "title": "AI Chatbot Development",
    "description": "Need an AI chatbot for customer support",
    "projectCategory": "ai_chatbots",
    "skillsRequired": ["JavaScript", "Python", "AI/ML"],
    "experienceLevel": "intermediate",
    "projectType": "one_time",
    "budget": {
      "min": 2000,
      "max": 5000,
      "isNegotiable": true
    }
  }'
```

#### **Get All Projects with Filters:**
```bash
curl -X GET "http://localhost:3300/api/v1/projects?search=chatbot&categories=ai_chatbots&budgetMin=1000&budgetMax=5000&sortBy=newest&page=1&limit=10" \
  -H "Content-Type: application/json"
```

#### **Get Project Details:**
```bash
curl -X GET http://localhost:3300/api/v1/projects/674a1234567890abcdef1234 \
  -H "Content-Type: application/json"
```

#### **Update Project:**
```bash
curl -X PUT http://localhost:3300/api/v1/projects/674a1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "title": "Updated AI Chatbot Development",
    "budget": {
      "min": 2500,
      "max": 6000
    }
  }'
```

#### **Update Project Status:**
```bash
curl -X PUT http://localhost:3300/api/v1/projects/674a1234567890abcdef1234/status \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "status": "active"
  }'
```

#### **Delete Project:**
```bash
curl -X DELETE http://localhost:3300/api/v1/projects/674a1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token"
```

---

## 🛠️ **JAVASCRIPT/FRONTEND EXAMPLES**

### **Create Project:**
```javascript
const createProject = async (projectData) => {
  try {
    const response = await fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(projectData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Project created:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};

// Usage
const newProject = await createProject({
  title: "AI Chatbot Development",
  description: "Need an AI chatbot for customer support",
  projectCategory: "ai_chatbots",
  skillsRequired: ["JavaScript", "Python", "AI/ML"],
  experienceLevel: "intermediate",
  projectType: "one_time",
  budget: {
    min: 2000,
    max: 5000,
    isNegotiable: true
  }
});
```

### **Get Projects with Filtering:**
```javascript
const getProjects = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`/api/v1/projects?${params}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get projects error:', error);
    throw error;
  }
};

// Usage
const projects = await getProjects({
  search: 'chatbot',
  categories: 'ai_chatbots,api_integration',
  budgetMin: 1000,
  budgetMax: 5000,
  sortBy: 'newest',
  page: 1,
  limit: 10
});
```

### **Update Project:**
```javascript
const updateProject = async (projectId, updateData) => {
  try {
    const response = await fetch(`/api/v1/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Project updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
};
```

### **Get Project Details:**
```javascript
const getProjectDetails = async (identifier) => {
  try {
    const response = await fetch(`/api/v1/projects/${identifier}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get project details error:', error);
    throw error;
  }
};

// Usage with ID
const project = await getProjectDetails('674a1234567890abcdef1234');

// Usage with slug
const project = await getProjectDetails('ai-chatbot-development-for-e-commerce-1721123456789');
```

### **Update Project Status:**
```javascript
const updateProjectStatus = async (projectId, status) => {
  try {
    const response = await fetch(`/api/v1/projects/${projectId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Project status updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update status error:', error);
    throw error;
  }
};

// Usage
await updateProjectStatus('674a1234567890abcdef1234', 'active');
```

### **Delete Project:**
```javascript
const deleteProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/projects/${projectId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Project deleted successfully');
      return true;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
};
```

---

## 🔧 **ENVIRONMENT VARIABLES**

### **Required Environment Variables:**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/llmbeing

# JWT Tokens
ACCESS_TOKEN_SECRET=your-access-token-secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRY=7d

# Server
PORT=3300
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

---

## 📈 **PERFORMANCE NOTES**

### **Database Optimization:**
- Full-text search indexes on title and description
- Compound indexes for filtering (category + status, skills, budget range)
- Proper pagination to handle large datasets
- Efficient aggregation for trending projects

### **Caching Recommendations:**
- Cache trending projects for 1 hour
- Cache most liked projects for 30 minutes
- Implement Redis for high-traffic scenarios

### **Rate Limiting:**
- Implement rate limiting for project creation (max 10 projects per hour per client)
- Search endpoints: 100 requests per minute per IP

---

**Last Updated:** July 21, 2025  
**API Version:** v1  
**Server Port:** 3300
