# 🚀 **GIGS API DOCUMENTATION**

> **Base URL:** `http://localhost:3300/api/v1/gigs`  
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

The Gigs API handles freelancer services (gigs) management including creation, updates, deletion, and browsing. Gigs are services offered by freelancers that clients can purchase.

### **Key Features:**
- ✅ **Gig CRUD operations** (Create, Read, Update, Delete)
- ✅ **Advanced filtering & search** (by skills, category, price range)
- ✅ **Multiple sorting options** (newest, price, rating, orders, views, popular)
- ✅ **Pagination support** for large datasets
- ✅ **Role-based access control** (Freelancer-only creation/management)
- ✅ **Gig status management** (draft, active, paused, inactive)
- ✅ **Package system** (Basic, Standard, Premium tiers)
- ✅ **Analytics tracking** (views, orders, ratings)

---

## 🔐 **AUTHENTICATION**

Most endpoints require authentication. Include the access token in cookies:

```
Cookie: accessToken=<jwt-access-token>
```

### **Role Permissions:**
- **Freelancers:** Can create, update, delete their own gigs
- **Clients:** Can browse and view all gigs
- **Public:** Can browse and view gigs (limited access)

---

## 📚 **API ENDPOINTS**

### 1. **Create Gig**
Create a new gig (Freelancer only).

**Endpoint:** `POST /gigs`  
**Authentication:** Required (Freelancer role)

#### **Request Body:**
```json
{
  "title": "AI-Powered Chatbot Development for E-commerce",
  "description": "I will create a sophisticated AI chatbot for your e-commerce platform that can handle customer inquiries, process orders, and provide 24/7 support. The chatbot will be integrated with natural language processing capabilities and can be customized to match your brand voice.",
  "category": "machine_learning",
  "skills": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing", "TensorFlow"],
  "price": 299,
  "deliveryTime": 7,
  "packages": [
    {
      "name": "Basic",
      "description": "Simple chatbot with basic Q&A functionality",
      "price": 299,
      "deliveryTime": 7,
      "features": [
        "Basic Q&A responses",
        "Simple integration",
        "Documentation",
        "1 revision"
      ],
      "revisions": 1
    },
    {
      "name": "Standard", 
      "description": "Advanced chatbot with NLP and custom training",
      "price": 599,
      "deliveryTime": 14,
      "features": [
        "Advanced NLP capabilities",
        "Custom training data",
        "API integration",
        "Documentation",
        "3 revisions",
        "30-day support"
      ],
      "revisions": 3
    },
    {
      "name": "Premium",
      "description": "Enterprise-level AI chatbot with full customization",
      "price": 1299,
      "deliveryTime": 21,
      "features": [
        "Enterprise AI capabilities",
        "Full customization",
        "Multiple platform integration",
        "Advanced analytics",
        "Documentation",
        "Unlimited revisions",
        "90-day support",
        "Training sessions"
      ],
      "revisions": 999
    }
  ],
  "tags": ["ai", "chatbot", "ecommerce", "automation", "customer-service"],
  "requirements": [
    "Provide your website URL and existing customer service workflows",
    "Share examples of common customer inquiries",
    "Specify integration requirements (website, CRM, etc.)"
  ],
  "faq": [
    {
      "question": "What programming languages do you use?",
      "answer": "I primarily use Python for AI/ML components and JavaScript/Node.js for web integration."
    },
    {
      "question": "Can you integrate with my existing website?",
      "answer": "Yes, I can integrate the chatbot with most websites and platforms including WordPress, Shopify, and custom applications."
    }
  ]
}
```

#### **Request Body Schema:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Gig title (10-100 chars) |
| description | string | Yes | Detailed description (50-5000 chars) |
| category | string | Yes | One of predefined categories |
| skills | array | Yes | Required skills |
| price | number | Yes | Starting price (minimum $1) |
| deliveryTime | number | Yes | Delivery time in days (minimum 1) |
| packages | array | No | Service packages (Basic, Standard, Premium) |
| tags | array | No | Search tags |
| requirements | array | No | Client requirements |
| faq | array | No | Frequently asked questions |

#### **Available Categories:**
- `machine_learning`, `natural_language_processing`, `computer_vision`, `data_science`
- `web_development`, `mobile_development`, `blockchain`, `cloud_computing`
- `automation`, `ai_integration`, `database`, `ui_ux`, `cybersecurity`, `game_development`, `iot`

#### **Response (201):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI-Powered Chatbot Development for E-commerce",
    "description": "I will create a sophisticated AI chatbot...",
    "category": "machine_learning",
    "skills": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing"],
    "price": 299,
    "deliveryTime": 7,
    "status": "active",
    "freelancer": {
      "_id": "674a1234567890abcdef5678",
      "fullName": "Sarah Johnson",
      "email": "sarah@freelancer.com",
      "avatar": "https://example.com/avatar.jpg",
      "profile": {
        "title": "AI/ML Engineer",
        "bio": "Specialized in AI chatbot development"
      },
      "skills": ["AI/ML", "Python", "JavaScript"],
      "rating": {
        "average": 4.8,
        "count": 156
      },
      "location": "San Francisco, CA"
    },
    "packages": [
      {
        "name": "Basic",
        "description": "Simple chatbot with basic Q&A functionality",
        "price": 299,
        "deliveryTime": 7,
        "features": ["Basic Q&A responses", "Simple integration"],
        "revisions": 1
      }
    ],
    "orders": 0,
    "rating": {
      "average": 0,
      "count": 0
    },
    "views": 0,
    "createdAt": "2025-07-21T10:30:00.000Z",
    "updatedAt": "2025-07-21T10:30:00.000Z"
  },
  "message": "Gig created successfully",
  "success": true
}
```

---

### 2. **Update Gig**
Update an existing gig (Freelancer only - own gigs).

**Endpoint:** `PUT /gigs/:id`  
**Authentication:** Required (Freelancer role, gig owner)

#### **Request Body:**
```json
{
  "title": "Advanced AI Chatbot Development for E-commerce",
  "price": 349,
  "deliveryTime": 5,
  "tags": ["ai", "chatbot", "ecommerce", "automation", "customer-service", "nlp"]
}
```

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "Advanced AI Chatbot Development for E-commerce",
    "price": 349,
    "deliveryTime": 5,
    "freelancer": {
      "_id": "674a1234567890abcdef5678",
      "fullName": "Sarah Johnson",
      "email": "sarah@freelancer.com",
      "avatar": "https://example.com/avatar.jpg"
    },
    "updatedAt": "2025-07-21T11:45:00.000Z"
  },
  "message": "Gig updated successfully",
  "success": true
}
```

---

### 3. **Delete Gig**
Delete a gig (Freelancer only - own gigs).

**Endpoint:** `DELETE /gigs/:id`  
**Authentication:** Required (Freelancer role, gig owner)

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI-Powered Chatbot Development for E-commerce",
    "status": "inactive"
  },
  "message": "Gig deleted successfully",
  "success": true
}
```

---

### 4. **Browse All Gigs**
Get all active gigs with advanced filtering and pagination.

**Endpoint:** `GET /gigs`  
**Authentication:** Optional

#### **Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | number | Page number (default: 1) | `?page=2` |
| limit | number | Items per page (default: 12) | `?limit=20` |
| search | string | Text search | `?search=chatbot` |
| category | string | Category filter | `?category=machine_learning` |
| skills | string | Comma-separated skills | `?skills=JavaScript,Python` |
| minPrice | number | Minimum price | `?minPrice=100` |
| maxPrice | number | Maximum price | `?maxPrice=1000` |
| status | string | Gig status (default: active) | `?status=active` |
| sortBy | string | Sort option | `?sortBy=price` |
| sortOrder | string | Sort direction (asc/desc) | `?sortOrder=asc` |

#### **Sort Options:**
- `createdAt` - Most recent gigs (default)
- `price` - Sort by price
- `rating` - Sort by rating
- `orders` - Sort by number of orders
- `views` - Sort by view count
- `popular` - Sort by popularity (orders + rating + views)

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "gigs": [
      {
        "_id": "674a1234567890abcdef1234",
        "title": "AI-Powered Chatbot Development for E-commerce",
        "description": "I will create a sophisticated AI chatbot...",
        "category": "machine_learning",
        "skills": ["JavaScript", "Python", "AI/ML"],
        "price": 299,
        "deliveryTime": 7,
        "status": "active",
        "freelancer": {
          "_id": "674a1234567890abcdef5678",
          "fullName": "Sarah Johnson",
          "email": "sarah@freelancer.com",
          "avatar": "https://example.com/avatar.jpg",
          "profile": {
            "title": "AI/ML Engineer"
          },
          "rating": {
            "average": 4.8,
            "count": 156
          }
        },
        "orders": 23,
        "rating": {
          "average": 4.9,
          "count": 18
        },
        "views": 342,
        "createdAt": "2025-07-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 156,
      "totalPages": 13,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Gigs fetched successfully",
  "success": true
}
```

---

### 5. **Get Gig Details**
Get detailed information about a specific gig.

**Endpoint:** `GET /gigs/:id`  
**Authentication:** Optional

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI-Powered Chatbot Development for E-commerce",
    "description": "I will create a sophisticated AI chatbot for your e-commerce platform...",
    "category": "machine_learning",
    "skills": ["JavaScript", "Python", "Node.js", "AI/ML", "Natural Language Processing"],
    "price": 299,
    "deliveryTime": 7,
    "status": "active",
    "freelancer": {
      "_id": "674a1234567890abcdef5678",
      "fullName": "Sarah Johnson",
      "email": "sarah@freelancer.com",
      "avatar": "https://example.com/avatar.jpg",
      "profile": {
        "title": "AI/ML Engineer & Chatbot Specialist",
        "bio": "I specialize in creating intelligent chatbots and AI solutions..."
      },
      "skills": ["AI/ML", "Python", "JavaScript", "TensorFlow"],
      "rating": {
        "average": 4.8,
        "count": 156
      },
      "location": "San Francisco, CA"
    },
    "packages": [
      {
        "name": "Basic",
        "description": "Simple chatbot with basic Q&A functionality",
        "price": 299,
        "deliveryTime": 7,
        "features": [
          "Basic Q&A responses",
          "Simple integration",
          "Documentation",
          "1 revision"
        ],
        "revisions": 1
      },
      {
        "name": "Standard",
        "description": "Advanced chatbot with NLP and custom training",
        "price": 599,
        "deliveryTime": 14,
        "features": [
          "Advanced NLP capabilities",
          "Custom training data",
          "API integration",
          "3 revisions"
        ],
        "revisions": 3
      },
      {
        "name": "Premium",
        "description": "Enterprise-level AI chatbot with full customization",
        "price": 1299,
        "deliveryTime": 21,
        "features": [
          "Enterprise AI capabilities",
          "Full customization",
          "Multiple platform integration",
          "Unlimited revisions"
        ],
        "revisions": 999
      }
    ],
    "orders": 23,
    "rating": {
      "average": 4.9,
      "count": 18
    },
    "views": 343,
    "tags": ["ai", "chatbot", "ecommerce", "automation"],
    "requirements": [
      "Provide your website URL and existing customer service workflows",
      "Share examples of common customer inquiries"
    ],
    "faq": [
      {
        "question": "What programming languages do you use?",
        "answer": "I primarily use Python for AI/ML components and JavaScript/Node.js for web integration."
      }
    ],
    "createdAt": "2025-07-21T10:30:00.000Z",
    "updatedAt": "2025-07-21T10:30:00.000Z"
  },
  "message": "Gig fetched successfully",
  "success": true
}
```

---

### 6. **Get My Gigs**
Get freelancer's own gigs with status filtering.

**Endpoint:** `GET /gigs/my-gigs`  
**Authentication:** Required (Freelancer role)

#### **Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Filter by gig status | `?status=active` |
| page | number | Page number | `?page=1` |
| limit | number | Items per page | `?limit=12` |

#### **Gig Status Options:**
- `draft` - Draft gigs
- `active` - Active gigs accepting orders
- `paused` - Temporarily paused gigs
- `inactive` - Inactive/deleted gigs

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "gigs": [
      {
        "_id": "674a1234567890abcdef1234",
        "title": "AI-Powered Chatbot Development",
        "status": "active",
        "price": 299,
        "orders": 23,
        "rating": {
          "average": 4.9,
          "count": 18
        },
        "views": 343,
        "createdAt": "2025-07-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 8,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "message": "User gigs fetched successfully",
  "success": true
}
```

---

### 7. **Update Gig Status**
Update the status of a gig.

**Endpoint:** `PUT /gigs/:id/status`  
**Authentication:** Required (Freelancer role, gig owner)

#### **Request Body:**
```json
{
  "status": "active"
}
```

#### **Allowed Status Values:**
- `draft` - Gig is in draft mode
- `active` - Gig is active and accepting orders
- `paused` - Gig is temporarily paused
- `inactive` - Gig is inactive/deleted

#### **Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "674a1234567890abcdef1234",
    "title": "AI-Powered Chatbot Development",
    "status": "active",
    "updatedAt": "2025-07-21T12:00:00.000Z"
  },
  "message": "Gig status updated successfully",
  "success": true
}
```

---

## ⚠️ **ERROR CODES**

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid data, validation errors |
| 401 | Unauthorized | Missing or invalid access token |
| 403 | Forbidden | Insufficient permissions, not gig owner |
| 404 | Not Found | Gig not found |
| 500 | Internal Server Error | Database errors, server issues |

### **Common Error Messages:**
| Error Message | Cause | Solution |
|--------------|-------|----------|
| "Only freelancers can create gigs" | Non-freelancer trying to create gig | Login as freelancer |
| "Gig not found" | Invalid gig ID | Check gig ID |
| "You can only update your own gigs" | Trying to update someone else's gig | Only update own gigs |
| "Failed to create gig" | Model validation errors | Check required fields |
| "Invalid status" | Invalid gig status value | Use allowed status values |

---

## 🚀 **SAMPLE REQUESTS**

### **cURL Examples:**

#### **Create Gig:**
```bash
curl -X POST http://localhost:3300/api/v1/gigs \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "title": "AI Chatbot Development",
    "description": "I will create an AI-powered chatbot for your business",
    "category": "machine_learning",
    "skills": ["JavaScript", "Python", "AI/ML"],
    "price": 299,
    "deliveryTime": 7,
    "packages": [
      {
        "name": "Basic",
        "description": "Basic chatbot functionality",
        "price": 299,
        "deliveryTime": 7,
        "features": ["Basic Q&A", "Documentation"],
        "revisions": 1
      }
    ]
  }'
```

#### **Browse Gigs with Filters:**
```bash
curl -X GET "http://localhost:3300/api/v1/gigs?search=chatbot&category=machine_learning&minPrice=100&maxPrice=1000&sortBy=rating&sortOrder=desc&page=1&limit=12" \
  -H "Content-Type: application/json"
```

#### **Get Gig Details:**
```bash
curl -X GET http://localhost:3300/api/v1/gigs/674a1234567890abcdef1234 \
  -H "Content-Type: application/json"
```

#### **Update Gig:**
```bash
curl -X PUT http://localhost:3300/api/v1/gigs/674a1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "title": "Advanced AI Chatbot Development",
    "price": 349
  }'
```

#### **Update Gig Status:**
```bash
curl -X PUT http://localhost:3300/api/v1/gigs/674a1234567890abcdef1234/status \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token" \
  -d '{
    "status": "paused"
  }'
```

#### **Delete Gig:**
```bash
curl -X DELETE http://localhost:3300/api/v1/gigs/674a1234567890abcdef1234 \
  -H "Content-Type: application/json" \
  -b "accessToken=your-access-token"
```

---

## 🛠️ **JAVASCRIPT/FRONTEND EXAMPLES**

### **Create Gig:**
```javascript
const createGig = async (gigData) => {
  try {
    const response = await fetch('/api/v1/gigs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(gigData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Gig created:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Create gig error:', error);
    throw error;
  }
};

// Usage
const newGig = await createGig({
  title: "AI Chatbot Development",
  description: "I will create an AI-powered chatbot for your business",
  category: "machine_learning",
  skills: ["JavaScript", "Python", "AI/ML"],
  price: 299,
  deliveryTime: 7
});
```

### **Browse Gigs with Filtering:**
```javascript
const browseGigs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`/api/v1/gigs?${params}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Browse gigs error:', error);
    throw error;
  }
};

// Usage
const gigsData = await browseGigs({
  search: 'chatbot',
  category: 'machine_learning',
  minPrice: 100,
  maxPrice: 1000,
  sortBy: 'rating',
  sortOrder: 'desc',
  page: 1,
  limit: 12
});
```

### **Get Gig Details:**
```javascript
const getGigDetails = async (gigId) => {
  try {
    const response = await fetch(`/api/v1/gigs/${gigId}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get gig details error:', error);
    throw error;
  }
};

// Usage
const gig = await getGigDetails('674a1234567890abcdef1234');
```

### **Update Gig:**
```javascript
const updateGig = async (gigId, updateData) => {
  try {
    const response = await fetch(`/api/v1/gigs/${gigId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Gig updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Update gig error:', error);
    throw error;
  }
};
```

### **Get My Gigs:**
```javascript
const getMyGigs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    const response = await fetch(`/api/v1/gigs/my-gigs?${params}`, {
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Get my gigs error:', error);
    throw error;
  }
};

// Usage
const myGigs = await getMyGigs({
  status: 'active',
  page: 1,
  limit: 12
});
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
- Text search indexes on title, description, skills, and tags
- Compound indexes for filtering (category + status, freelancer + status, price range)
- Proper pagination to handle large datasets
- Efficient population of freelancer data

### **Caching Recommendations:**
- Cache popular gigs for 30 minutes
- Cache category-based searches for 15 minutes
- Implement Redis for high-traffic scenarios

### **Rate Limiting:**
- Implement rate limiting for gig creation (max 5 gigs per hour per freelancer)
- Search endpoints: 100 requests per minute per IP
- View tracking: 1 view per IP per hour per gig

---

**Last Updated:** July 21, 2025  
**API Version:** v1  
**Server Port:** 3300
