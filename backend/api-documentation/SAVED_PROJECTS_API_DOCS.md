# SAVED PROJECTS API DOCUMENTATION
## Complete Frontend Implementation Guide

### BASE URL
```
http://localhost:3300/api/saved-projects
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

### 1. GET SAVED PROJECTS
**Endpoint:** `GET /api/saved-projects`
**Description:** Get user's saved projects with pagination

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
const getSavedProjects = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(`/api/saved-projects?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching saved projects:', error);
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
        "_id": "savedProjectId",
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
          "deadline": "2025-08-15",
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
  "message": "Saved projects retrieved successfully",
  "success": true
}
```

---

### 2. TOGGLE SAVE PROJECT
**Endpoint:** `POST /api/saved-projects/toggle/:projectId`
**Description:** Smart toggle - saves if not saved, unsaves if already saved

#### Frontend Call:
```javascript
const toggleSaveProject = async (projectId) => {
  try {
    const response = await fetch(`/api/saved-projects/toggle/${projectId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling save status:', error);
  }
};
```

#### Response (When Saving):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "saved",
    "message": "Project saved successfully"
  },
  "message": "Project saved successfully",
  "success": true
}
```

#### Response (When Unsaving):
```javascript
{
  "statusCode": 200,
  "data": {
    "action": "unsaved", 
    "message": "Project removed from saved list"
  },
  "message": "Project removed from saved list",
  "success": true
}
```

---

### 3. DELETE SPECIFIC SAVED PROJECT
**Endpoint:** `DELETE /api/saved-projects/:projectId`
**Description:** Remove specific project from saved list

#### Frontend Call:
```javascript
const deleteSavedProject = async (projectId) => {
  try {
    const response = await fetch(`/api/saved-projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting saved project:', error);
  }
};
```

#### Response:
```javascript
{
  "statusCode": 200,
  "data": null,
  "message": "Project removed from saved list successfully",
  "success": true
}
```

---

### 4. DELETE ALL SAVED PROJECTS
**Endpoint:** `DELETE /api/saved-projects/all`
**Description:** Remove all saved projects for the user

#### Frontend Call:
```javascript
const deleteAllSavedProjects = async () => {
  try {
    const response = await fetch('/api/saved-projects/all', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting all saved projects:', error);
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
  "message": "15 saved projects removed successfully",
  "success": true
}
```

---

## 🔧 FRONTEND IMPLEMENTATION GUIDE

### React Hook Example:
```javascript
import { useState, useEffect } from 'react';

const useSavedProjects = () => {
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchSavedProjects = async (page = 1) => {
    setLoading(true);
    try {
      const data = await getSavedProjects(page);
      setSavedProjects(data.data.projects);
      setPagination(data.data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSave = async (projectId) => {
    try {
      const result = await toggleSaveProject(projectId);
      if (result.data.action === 'unsaved') {
        // Remove from current list
        setSavedProjects(prev => 
          prev.filter(item => item.project._id !== projectId)
        );
      }
      return result;
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  return {
    savedProjects,
    loading,
    pagination,
    fetchSavedProjects,
    handleToggleSave
  };
};
```

### Save Button Component:
```javascript
const SaveButton = ({ projectId, isSaved, onToggle }) => {
  const [saving, setSaving] = useState(false);

  const handleClick = async () => {
    setSaving(true);
    try {
      const result = await toggleSaveProject(projectId);
      onToggle(result.data.action === 'saved');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button 
      onClick={handleClick} 
      disabled={saving}
      className={`save-btn ${isSaved ? 'saved' : 'unsaved'}`}
    >
      {saving ? '...' : (isSaved ? '❤️ Saved' : '🤍 Save')}
    </button>
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
  "message": "Failed to toggle save status: [error details]",
  "success": false
}
```

### Frontend Error Handling:
```javascript
const handleApiCall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    
    if (!response.success) {
      throw new Error(response.message);
    }
    
    return response.data;
  } catch (error) {
    // Show user-friendly error message
    showToast(error.message || 'Something went wrong');
    throw error;
  }
};
```

---

## 📱 UI/UX SUGGESTIONS

### 1. Saved Projects Page:
- ✅ Pagination controls
- ✅ Empty state when no saved projects
- ✅ Loading skeletons
- ✅ Bulk delete option
- ✅ Search/filter within saved projects

### 2. Project Cards:
- ✅ Heart icon with save/unsave toggle
- ✅ Visual feedback on save action
- ✅ Optimistic UI updates

### 3. Loading States:
- ✅ Button loading for toggle actions
- ✅ Page loading for list fetch
- ✅ Skeleton cards while loading

### 4. Success Messages:
- ✅ Toast notifications for save/unsave
- ✅ Confirmation before bulk delete
- ✅ Success animation on save

---

## 🔗 INTEGRATION CHECKLIST

### Backend Setup:
- [x] SavedProject model created
- [x] Controller functions implemented
- [x] Routes defined
- [ ] Add to main app.js: `app.use('/api/saved-projects', savedProjectRoutes)`

### Frontend Setup:
- [ ] API service functions
- [ ] React hooks for state management
- [ ] UI components (SaveButton, SavedProjectsList)
- [ ] Error handling
- [ ] Loading states
- [ ] Pagination component

### Testing:
- [ ] Test all API endpoints
- [ ] Test authentication
- [ ] Test pagination
- [ ] Test error scenarios
- [ ] UI/UX testing

This documentation provides everything needed for seamless frontend integration!
