# DISLIKED PROJECTS API DOCUMENTATION
## Complete Frontend Implementation Guide

### BASE URL
```
http://localhost:3300/api/v1/disliked-projects
```

### AUTHENTICATION
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---
✅ **Freelancers** can save/like/dislike projects they're interested in
- ❌ **Clients** cannot interact with projects (they manage them directly)
- ❌ **Admins** use separate administrative endpoints


## 📋 API ENDPOINTS

### 1. GET DISLIKED PROJECTS
**Endpoint:** `GET /api/v1/disliked-projects`
**Description:** Get user's disliked projects with pagination

#### Request Parameters:
```javascript
// Query Parameters (Optional)
{
  page: 1,        // Page number (default: 1)
  limit: 20       // Items per page (default: 20)
}
```

#### Frontend Call:
```javascript
const getDislikedProjects = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching disliked projects:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "projects": [
      {
        "_id": "dislikedProjectId",
        "user": "userId",
        "project": {
          "_id": "projectId",
          "title": "Project Title",
          "description": "Project description...",
          "budget": {
            "min": 1000,
            "max": 5000
          },
          "skills": ["React", "Node.js"],
          "client": {
            "_id": "clientId",
            "userName": "clientname",
            "fullName": "Client Full Name",
            "profileImage": "image_url",
            "averageRating": 4.5
          },
          "stats": {
            "likeCount": 5,
            "dislikeCount": 12
          },
          "isActive": true
        },
        "createdAt": "2025-07-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalCount": 25,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Disliked projects retrieved successfully",
  "success": true
}
```

---

### 2. TOGGLE DISLIKE PROJECT
**Endpoint:** `POST /api/v1/disliked-projects/dislike/:projectId`
**Description:** Smart toggle - dislikes if not disliked, removes dislike if already disliked. Automatically removes like if exists.

#### Frontend Call:
```javascript
const toggleDislikeProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects/dislike/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling dislike:', error);
  }
};
```

#### Response (When Disliking):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "disliked",
    "message": "Project disliked successfully"
  },
  "message": "Project disliked successfully",
  "success": true
}
```

#### Response (When Removing Dislike):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "undisliked",
    "message": "Project dislike removed successfully"
  },
  "message": "Project dislike removed successfully",
  "success": true
}
```

---

### 3. GET PROJECT DISLIKE STATUS
**Endpoint:** `GET /api/v1/disliked-projects/status/:projectId`
**Description:** Get user's current dislike status for a specific project

#### Frontend Call:
```javascript
const getProjectDislikeStatus = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects/status/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting dislike status:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "isDisliked": true,
    "dislikedAt": "2025-07-20T10:30:00.000Z"
  },
  "message": "Project dislike status retrieved successfully",
  "success": true
}
```

---

### 4. GET PROJECT DISLIKERS
**Endpoint:** `GET /api/v1/disliked-projects/dislikers/:projectId`
**Description:** Get list of users who disliked a specific project

#### Request Parameters:
```javascript
// Query Parameters (Optional)
{
  page: 1,        // Page number (default: 1)
  limit: 50       // Items per page (default: 50)
}
```

#### Frontend Call:
```javascript
const getProjectDislikers = async (projectId, page = 1, limit = 50) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects/dislikers/${projectId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dislikers:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "dislikers": [
      {
        "_id": "dislikedProjectId",
        "user": {
          "_id": "userId",
          "userName": "john_doe",
          "fullName": "John Doe",
          "profileImage": "profile_url",
          "averageRating": 3.2
        },
        "createdAt": "2025-07-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 12,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "message": "Project dislikers retrieved successfully",
  "success": true
}
```

---

### 5. GET TOP DISLIKED PROJECTS
**Endpoint:** `GET /api/v1/disliked-projects/top`
**Description:** Get projects with highest dislike counts (useful for analytics/moderation)

#### Request Parameters:
```javascript
// Query Parameters (Optional)
{
  page: 1,        // Page number (default: 1)
  limit: 10       // Items per page (default: 10)
}
```

#### Frontend Call:
```javascript
const getTopDislikedProjects = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects/top?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top disliked projects:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "projects": [
      {
        "_id": "projectId",
        "title": "Poorly Described Project",
        "description": "Very vague requirements...",
        "budget": {
          "min": 50,
          "max": 100
        },
        "client": {
          "_id": "clientId",
          "userName": "difficult_client",
          "fullName": "Difficult Client",
          "profileImage": "image_url"
        },
        "stats": {
          "likeCount": 2,
          "dislikeCount": 45
        },
        "createdAt": "2025-07-15T08:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 28,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Top disliked projects retrieved successfully",
  "success": true
}
```

---

### 6. DELETE SPECIFIC DISLIKED PROJECT
**Endpoint:** `DELETE /api/v1/disliked-projects/:projectId`
**Description:** Remove specific project from disliked list

#### Frontend Call:
```javascript
const deleteDislikedProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/disliked-projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting disliked project:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": null,
  "message": "Project removed from disliked list successfully",
  "success": true
}
```

---

### 7. DELETE ALL DISLIKED PROJECTS
**Endpoint:** `DELETE /api/v1/disliked-projects/all`
**Description:** Remove all disliked projects for the user

#### Frontend Call:
```javascript
const deleteAllDislikedProjects = async () => {
  try {
    const response = await fetch('/api/v1/disliked-projects/all', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting all disliked projects:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "deletedCount": 15
  },
  "message": "15 disliked projects removed successfully",
  "success": true
}
```

---

## 🔧 FRONTEND IMPLEMENTATION GUIDE

### React Hook Example:
```javascript
import { useState, useEffect } from 'react';

const useDislikedProjects = () => {
  const [dislikedProjects, setDislikedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchDislikedProjects = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getDislikedProjects(page);
      setDislikedProjects(data.data.projects);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDislike = async (projectId) => {
    try {
      const result = await toggleDislikeProject(projectId);
      if (result.data.action === 'undisliked') {
        // Remove from current list
        setDislikedProjects(prev => 
          prev.filter(item => item.project._id !== projectId)
        );
      }
      return result;
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  return {
    dislikedProjects,
    loading,
    pagination,
    fetchDislikedProjects,
    handleToggleDislike
  };
};
```

### Dislike Button Component:
```javascript
const DislikeButton = ({ projectId, isDisliked, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const result = await toggleDislikeProject(projectId);
      onToggle(result.data.action === 'disliked');
    } catch (error) {
      console.error('Dislike error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={loading}
      className={`dislike-btn ${isDisliked ? 'disliked' : 'neutral'}`}
    >
      {loading ? '...' : (isDisliked ? '👎 Disliked' : '👎 Dislike')}
    </button>
  );
};
```

### Combined Like/Dislike Component:
```javascript
const LikeDislikeButtons = ({ projectId }) => {
  const [status, setStatus] = useState({ isLiked: false, isDisliked: false });
  const [loading, setLoading] = useState({ like: false, dislike: false });

  // Fetch initial status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [likeStatus, dislikeStatus] = await Promise.all([
          getProjectLikeStatus(projectId),
          getProjectDislikeStatus(projectId)
        ]);
        setStatus({
          isLiked: likeStatus.data.isLiked,
          isDisliked: dislikeStatus.data.isDisliked
        });
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };
    
    fetchStatus();
  }, [projectId]);

  const handleLike = async () => {
    setLoading(prev => ({ ...prev, like: true }));
    try {
      const result = await toggleLikeProject(projectId);
      setStatus(prev => ({
        isLiked: result.data.action === 'liked',
        isDisliked: false // Auto-remove dislike
      }));
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLoading(prev => ({ ...prev, like: false }));
    }
  };

  const handleDislike = async () => {
    setLoading(prev => ({ ...prev, dislike: true }));
    try {
      const result = await toggleDislikeProject(projectId);
      setStatus(prev => ({
        isLiked: false, // Auto-remove like
        isDisliked: result.data.action === 'disliked'
      }));
    } catch (error) {
      console.error('Dislike error:', error);
    } finally {
      setLoading(prev => ({ ...prev, dislike: false }));
    }
  };

  return (
    <div className="like-dislike-container">
      <button 
        onClick={handleLike}
        disabled={loading.like}
        className={`like-btn ${status.isLiked ? 'active' : ''}`}
      >
        {loading.like ? '...' : '👍'} {status.isLiked ? 'Liked' : 'Like'}
      </button>
      
      <button 
        onClick={handleDislike}
        disabled={loading.dislike}
        className={`dislike-btn ${status.isDisliked ? 'active' : ''}`}
      >
        {loading.dislike ? '...' : '👎'} {status.isDisliked ? 'Disliked' : 'Dislike'}
      </button>
    </div>
  );
};
```

---

## 🚨 ERROR HANDLING

### Common Error Responses:
```javascript
// 400 - Bad Request
{
  "statusCode": 400,
  "message": "Project ID is required",
  "success": false
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Access token is required",
  "success": false
}

// 404 - Not Found
{
  "statusCode": 404,
  "message": "Project not found or inactive",
  "success": false
}

// 500 - Server Error
{
  "statusCode": 500,
  "message": "Failed to toggle dislike status: [error details]",
  "success": false
}
```

---

## 📱 UI/UX SUGGESTIONS

### 1. Disliked Projects Page:
- ✅ Option to "give second chance" (remove from disliked)
- ✅ Reasons for dislike (future enhancement)
- ✅ Analytics dashboard for admins
- ✅ Filter by dislike date

### 2. Project Cards:
- ✅ Clear visual distinction for disliked projects
- ✅ Option to provide feedback
- ✅ Quick actions (remove dislike, block client)

### 3. Analytics Features:
- ✅ Top disliked projects for quality control
- ✅ Client reputation based on project dislikes
- ✅ Trend analysis for platform improvement

---

## 🔗 INTEGRATION CHECKLIST

### Backend Setup:
- [x] DislikedProject model analyzed
- [x] Controller functions implemented
- [x] Routes defined
- [x] Added to main app.js

### Frontend Setup:
- [ ] API service functions
- [ ] React hooks for state management
- [ ] UI components (DislikeButton, DislikedProjectsList)
- [ ] Combined Like/Dislike components
- [ ] Error handling
- [ ] Loading states
- [ ] Analytics dashboard (admin)

### Key Features:
- [x] Smart dislike toggling
- [x] Automatic count updates
- [x] Mutual exclusivity with likes
- [x] Project dislikers listing
- [x] Top disliked projects analytics
- [x] Comprehensive error handling
- [x] Bulk operations support

This implementation provides complete dislike functionality with analytics capabilities for platform quality control! 🚀
