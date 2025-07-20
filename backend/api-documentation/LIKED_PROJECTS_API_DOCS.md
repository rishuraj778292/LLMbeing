# LIKED PROJECTS API DOCUMENTATION
## Complete Frontend Implementation Guide

### BASE URL
```
http://localhost:3300/api/v1/liked-projects
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


## API ENDPOINTS

### 1. GET LIKED PROJECTS
**Endpoint:** `GET /api/v1/liked-projects`
**Description:** Get user's liked projects with pagination

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
const getLikedProjects = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/v1/liked-projects?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching liked projects:', error);
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
        "_id": "likedProjectId",
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
            "likeCount": 25,
            "dislikeCount": 2
          },
          "isActive": true
        },
        "createdAt": "2025-07-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 45,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Liked projects retrieved successfully",
  "success": true
}
```

---

### 2. TOGGLE LIKE PROJECT
**Endpoint:** `POST /api/v1/liked-projects/like/:projectId`
**Description:** Smart toggle - likes if not liked, unlikes if already liked. Automatically removes dislike if exists.

#### Frontend Call:
```javascript
const toggleLikeProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/liked-projects/like/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling like:', error);
  }
};
```

#### Response (When Liking):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "liked",
    "message": "Project liked successfully"
  },
  "message": "Project liked successfully",
  "success": true
}
```

#### Response (When Unliking):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "unliked",
    "message": "Project unliked successfully"
  },
  "message": "Project unliked successfully",
  "success": true
}
```

---

### 3. TOGGLE DISLIKE PROJECT
**Endpoint:** `POST /api/v1/liked-projects/dislike/:projectId`
**Description:** Smart toggle - dislikes if not disliked, removes dislike if already disliked. Automatically removes like if exists.

#### Frontend Call:
```javascript
const toggleDislikeProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/liked-projects/dislike/${projectId}`, {
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

### 4. GET PROJECT LIKE STATUS
**Endpoint:** `GET /api/v1/liked-projects/status/:projectId`
**Description:** Get user's current like/dislike status for a specific project

#### Frontend Call:
```javascript
const getProjectLikeStatus = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/liked-projects/status/${projectId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting like status:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "isDisliked": false,
    "likedAt": "2025-07-20T10:30:00.000Z",
    "dislikedAt": null
  },
  "message": "Project like status retrieved successfully",
  "success": true
}
```

---

### 5. GET PROJECT LIKERS
**Endpoint:** `GET /api/v1/liked-projects/likers/:projectId`
**Description:** Get list of users who liked a specific project

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
const getProjectLikers = async (projectId, page = 1, limit = 50) => {
  try {
    const response = await fetch(`/api/v1/liked-projects/likers/${projectId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching likers:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "likers": [
      {
        "_id": "likedProjectId",
        "user": {
          "_id": "userId",
          "userName": "john_doe",
          "fullName": "John Doe",
          "profileImage": "profile_url",
          "averageRating": 4.8
        },
        "createdAt": "2025-07-20T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalCount": 75,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "message": "Project likers retrieved successfully",
  "success": true
}
```

---

### 6. DELETE SPECIFIC LIKED PROJECT
**Endpoint:** `DELETE /api/v1/liked-projects/:projectId`
**Description:** Remove specific project from liked list

#### Frontend Call:
```javascript
const deleteLikedProject = async (projectId) => {
  try {
    const response = await fetch(`/api/v1/liked-projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting liked project:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": null,
  "message": "Project removed from liked list successfully",
  "success": true
}
```

---

### 7. DELETE ALL LIKED PROJECTS
**Endpoint:** `DELETE /api/v1/liked-projects/all`
**Description:** Remove all liked projects for the user

#### Frontend Call:
```javascript
const deleteAllLikedProjects = async () => {
  try {
    const response = await fetch('/api/v1/liked-projects/all', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting all liked projects:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "deletedCount": 25
  },
  "message": "25 liked projects removed successfully",
  "success": true
}
```

---

## 🔧 FRONTEND IMPLEMENTATION GUIDE

### React Hook Example:
```javascript
import { useState, useEffect } from 'react';

const useLikedProjects = () => {
  const [likedProjects, setLikedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchLikedProjects = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getLikedProjects(page);
      setLikedProjects(data.data.projects);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (projectId) => {
    try {
      const result = await toggleLikeProject(projectId);
      if (result.data.action === 'unliked') {
        // Remove from current list
        setLikedProjects(prev => 
          prev.filter(item => item.project._id !== projectId)
        );
      }
      return result;
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleToggleDislike = async (projectId) => {
    try {
      const result = await toggleDislikeProject(projectId);
      return result;
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  return {
    likedProjects,
    loading,
    pagination,
    fetchLikedProjects,
    handleToggleLike,
    handleToggleDislike
  };
};
```

### Like/Dislike Button Component:
```javascript
const LikeDislikeButtons = ({ projectId, initialStatus, onUpdate }) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState({ like: false, dislike: false });

  const handleLike = async () => {
    setLoading(prev => ({ ...prev, like: true }));
    try {
      const result = await toggleLikeProject(projectId);
      const newStatus = {
        ...status,
        isLiked: result.data.action === 'liked',
        isDisliked: false // Auto-remove dislike
      };
      setStatus(newStatus);
      onUpdate?.(newStatus);
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
      const newStatus = {
        ...status,
        isDisliked: result.data.action === 'disliked',
        isLiked: false // Auto-remove like
      };
      setStatus(newStatus);
      onUpdate?.(newStatus);
    } catch (error) {
      console.error('Dislike error:', error);
    } finally {
      setLoading(prev => ({ ...prev, dislike: false }));
    }
  };

  return (
    <div className="like-dislike-buttons">
      <button 
        onClick={handleLike} 
        disabled={loading.like}
        className={`like-btn ${status.isLiked ? 'liked' : ''}`}
      >
        {loading.like ? '...' : (status.isLiked ? '👍 Liked' : '👍 Like')}
      </button>
      
      <button 
        onClick={handleDislike} 
        disabled={loading.dislike}
        className={`dislike-btn ${status.isDisliked ? 'disliked' : ''}`}
      >
        {loading.dislike ? '...' : (status.isDisliked ? '👎 Disliked' : '👎 Dislike')}
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
  "message": "Failed to toggle like status: [error details]",
  "success": false
}
```

---

## 📱 UI/UX SUGGESTIONS

### 1. Liked Projects Page:
- ✅ Pagination controls
- ✅ Empty state when no liked projects
- ✅ Loading skeletons
- ✅ Bulk unlike option
- ✅ Filter and search capabilities

### 2. Like/Dislike Buttons:
- ✅ Visual feedback on interaction
- ✅ Mutual exclusivity (like removes dislike and vice versa)
- ✅ Loading states
- ✅ Optimistic UI updates

### 3. Project Likers Modal:
- ✅ User avatars and names
- ✅ Pagination for large lists
- ✅ User profile links

---

## 🔗 INTEGRATION CHECKLIST

### Backend Setup:
- [x] LikedProject model created
- [x] DislikedProject model created
- [x] Controller functions implemented
- [x] Routes defined
- [x] Added to main app.js

### Frontend Setup:
- [ ] API service functions
- [ ] React hooks for state management
- [ ] UI components (LikeButtons, LikedProjectsList)
- [ ] Error handling
- [ ] Loading states
- [ ] Pagination component

### Key Features:
- [x] Smart like/dislike toggling
- [x] Automatic count updates
- [x] User array synchronization
- [x] Mutual exclusivity (like removes dislike)
- [x] Project likers listing
- [x] Comprehensive error handling

This implementation provides complete like/dislike functionality with intelligent behavior and seamless user experience! 🚀
