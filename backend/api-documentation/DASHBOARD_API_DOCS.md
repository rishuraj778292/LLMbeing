# DASHBOARD API DOCUMENTATION
## Role-Based Dashboard Implementation Guide

### BASE URL
```
http://localhost:8000/api/v1/dashboard
```

### AUTHENTICATION
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 📋 API ENDPOINTS

### 1. GET COMPLETE DASHBOARD DATA
**Endpoint:** `GET /api/v1/dashboard`
**Description:** Get complete role-based dashboard data (freelancer or client)

#### Frontend Call:
```javascript
const getDashboardData = async () => {
  try {
    const response = await fetch('/api/v1/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};
```

---

## 🎯 FREELANCER DASHBOARD RESPONSE

```javascript
{
  "statusCode": 200,
  "data": {
    "role": "freelancer",
    "stats": {
      "applications": {
        "pending": 12,
        "interviewing": 3,
        "accepted": 5,
        "rejected": 8,
        "withdrawn": 2,
        "submitted": 1,
        "completed": 15
      },
      "totalApplications": 46,
      "totalEarnings": 12500,
      "interactions": {
        "savedProjects": 25,
        "likedProjects": 18,
        "dislikedProjects": 5
      }
    },
    "recentProjects": [
      {
        "_id": "projectId",
        "title": "AI Chatbot Development",
        "description": "Build a customer service chatbot...",
        "budget": {
          "min": 1000,
          "max": 3000
        },
        "skillsRequired": ["React", "Node.js", "AI"],
        "projectCategory": ["ai_chatbots"],
        "deadline": "2025-08-15T00:00:00.000Z",
        "createdAt": "2025-07-20T10:30:00.000Z",
        "client": {
          "_id": "clientId",
          "userName": "tech_startup",
          "fullName": "Tech Startup Inc",
          "profileImage": "image_url",
          "averageRating": 4.8
        }
      }
    ],
    "ongoingApplications": [
      {
        "_id": "applicationId",
        "proposedBudget": 2500,
        "expectedDelivery": 30,
        "acceptedAt": "2025-07-15T09:00:00.000Z",
        "project": {
          "_id": "projectId",
          "title": "E-commerce Platform",
          "budget": { "min": 2000, "max": 4000 },
          "projectStatus": "in_progress",
          "deadline": "2025-08-20T00:00:00.000Z",
          "client": {
            "userName": "online_store",
            "fullName": "Online Store Ltd",
            "profileImage": "image_url"
          }
        }
      }
    ],
    "completedApplications": [
      {
        "_id": "applicationId",
        "proposedBudget": 1500,
        "completedAt": "2025-07-10T15:30:00.000Z",
        "project": {
          "title": "Website Redesign",
          "client": {
            "userName": "design_agency",
            "fullName": "Design Agency Pro"
          }
        }
      }
    ],
    "recentGigs": [
      {
        "_id": "gigId",
        "title": "WordPress Development",
        "description": "I will create custom WordPress websites...",
        "price": 150,
        "status": "active",
        "rating": {
          "average": 4.9,
          "count": 23
        },
        "orders": 45,
        "views": 1250
      }
    ],
    "quickActions": [
      { "name": "Browse Projects", "path": "/projects", "icon": "search" },
      { "name": "My Applications", "path": "/applications", "icon": "file-text" },
      { "name": "Create Gig", "path": "/gigs/create", "icon": "plus" },
      { "name": "Saved Projects", "path": "/saved-projects", "icon": "bookmark" }
    ]
  },
  "message": "Dashboard data retrieved successfully",
  "success": true
}
```

---

## 🏢 CLIENT DASHBOARD RESPONSE

```javascript
{
  "statusCode": 200,
  "data": {
    "role": "client",
    "stats": {
      "projects": {
        "draft": 2,
        "active": 5,
        "in_progress": 3,
        "completed": 12,
        "cancelled": 1,
        "paused": 0
      },
      "totalProjects": 23,
      "applications": {
        "pending": 45,
        "interviewing": 8,
        "accepted": 15,
        "rejected": 22,
        "completed": 12
      },
      "totalSpent": 35000
    },
    "postedProjects": [
      {
        "_id": "projectId",
        "title": "Mobile App Development",
        "description": "Need a React Native app...",
        "budget": { "min": 3000, "max": 6000 },
        "projectStatus": "active",
        "skillsRequired": ["React Native", "Firebase"],
        "deadline": "2025-09-01T00:00:00.000Z",
        "createdAt": "2025-07-18T14:20:00.000Z",
        "stats": {
          "viewCount": 125,
          "proposalCount": 18,
          "likeCount": 12
        }
      }
    ],
    "latestApplications": [
      {
        "_id": "applicationId",
        "proposedBudget": 4500,
        "expectedDelivery": 45,
        "coverLetter": "I have 5+ years experience...",
        "createdAt": "2025-07-20T08:30:00.000Z",
        "project": {
          "title": "Mobile App Development",
          "budget": { "min": 3000, "max": 6000 }
        },
        "freelancer": {
          "_id": "freelancerId",
          "userName": "mobile_expert",
          "fullName": "John Doe",
          "profileImage": "image_url",
          "averageRating": 4.9,
          "skills": ["React Native", "iOS", "Android"]
        }
      }
    ],
    "activeProjects": [
      {
        "_id": "projectId",
        "title": "Website Redesign",
        "budget": { "min": 2000, "max": 4000 },
        "projectStatus": "in_progress",
        "deadline": "2025-08-10T00:00:00.000Z",
        "assignedFreelancer": {
          "userName": "design_pro",
          "fullName": "Jane Smith",
          "profileImage": "image_url",
          "averageRating": 4.8
        },
        "stats": {
          "viewCount": 85,
          "proposalCount": 12
        }
      }
    ],
    "completedProjects": [
      {
        "_id": "projectId",
        "title": "Logo Design",
        "budget": { "min": 500, "max": 800 },
        "completedAt": "2025-07-15T12:00:00.000Z",
        "assignedFreelancer": {
          "userName": "creative_designer",
          "fullName": "Mike Johnson",
          "averageRating": 5.0
        }
      }
    ],
    "latestGigs": [
      {
        "_id": "gigId",
        "title": "Professional Logo Design",
        "description": "I will design a professional logo...",
        "price": 75,
        "deliveryTime": 3,
        "skills": ["Photoshop", "Illustrator"],
        "category": "design",
        "rating": {
          "average": 4.9,
          "count": 156
        },
        "orders": 340,
        "freelancer": {
          "userName": "design_master",
          "fullName": "Sarah Wilson",
          "profileImage": "image_url",
          "averageRating": 4.9
        }
      }
    ],
    "quickActions": [
      { "name": "Post Project", "path": "/projects/create", "icon": "plus" },
      { "name": "Browse Freelancers", "path": "/freelancers", "icon": "users" },
      { "name": "My Projects", "path": "/projects/my", "icon": "folder" },
      { "name": "Received Applications", "path": "/applications/received", "icon": "inbox" }
    ]
  },
  "message": "Dashboard data retrieved successfully",
  "success": true
}
```

---

### 2. GET DASHBOARD STATISTICS ONLY
**Endpoint:** `GET /api/v1/dashboard/stats`
**Description:** Get lightweight dashboard statistics only (faster loading)

#### Frontend Call:
```javascript
const getDashboardStats = async () => {
  try {
    const response = await fetch('/api/v1/dashboard/stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};
```

#### Freelancer Stats Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "role": "freelancer",
    "applications": {
      "pending": 12,
      "interviewing": 3,
      "accepted": 5,
      "completed": 15
    },
    "savedProjects": 25,
    "likedProjects": 18,
    "myGigs": 8
  },
  "message": "Dashboard statistics retrieved successfully",
  "success": true
}
```

#### Client Stats Response:
```javascript
{
  "statusCode": 200,
  "data": {
    "role": "client",
    "projects": {
      "draft": 2,
      "active": 5,
      "in_progress": 3,
      "completed": 12
    },
    "applications": {
      "pending": 45,
      "accepted": 15,
      "completed": 12
    }
  },
  "message": "Dashboard statistics retrieved successfully",
  "success": true
}
```

---

## 🔧 FRONTEND IMPLEMENTATION GUIDE

### React Dashboard Hook:
```javascript
import { useState, useEffect } from 'react';

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData();
      setDashboardData(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchStats();
  }, []);

  return {
    dashboardData,
    stats,
    loading,
    error,
    refetch: fetchDashboardData,
    refreshStats: fetchStats
  };
};
```

### Dashboard Component Example:
```javascript
const Dashboard = () => {
  const { dashboardData, loading, error } = useDashboard();

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!dashboardData) return null;

  return (
    <div className="dashboard">
      <DashboardHeader user={dashboardData} />
      
      {dashboardData.role === 'freelancer' ? (
        <FreelancerDashboard data={dashboardData} />
      ) : (
        <ClientDashboard data={dashboardData} />
      )}
    </div>
  );
};

const FreelancerDashboard = ({ data }) => {
  return (
    <div className="freelancer-dashboard">
      <div className="stats-grid">
        <StatsCard 
          title="Total Applications" 
          value={data.stats.totalApplications}
          icon="file-text"
        />
        <StatsCard 
          title="Total Earnings" 
          value={`$${data.stats.totalEarnings.toLocaleString()}`}
          icon="dollar-sign"
        />
        <StatsCard 
          title="Active Projects" 
          value={data.ongoingApplications.length}
          icon="briefcase"
        />
        <StatsCard 
          title="Saved Projects" 
          value={data.stats.interactions.savedProjects}
          icon="bookmark"
        />
      </div>

      <div className="dashboard-sections">
        <Section title="Recent Projects" data={data.recentProjects} />
        <Section title="Ongoing Work" data={data.ongoingApplications} />
        <Section title="My Gigs" data={data.recentGigs} />
      </div>

      <QuickActions actions={data.quickActions} />
    </div>
  );
};

const ClientDashboard = ({ data }) => {
  return (
    <div className="client-dashboard">
      <div className="stats-grid">
        <StatsCard 
          title="Total Projects" 
          value={data.stats.totalProjects}
          icon="folder"
        />
        <StatsCard 
          title="Total Spent" 
          value={`$${data.stats.totalSpent.toLocaleString()}`}
          icon="credit-card"
        />
        <StatsCard 
          title="Active Projects" 
          value={data.stats.projects.active}
          icon="activity"
        />
        <StatsCard 
          title="Pending Applications" 
          value={data.stats.applications.pending}
          icon="clock"
        />
      </div>

      <div className="dashboard-sections">
        <Section title="My Projects" data={data.postedProjects} />
        <Section title="Latest Applications" data={data.latestApplications} />
        <Section title="Available Freelancers" data={data.latestGigs} />
      </div>

      <QuickActions actions={data.quickActions} />
    </div>
  );
};
```

---

## 📊 DASHBOARD FEATURES

### Freelancer Dashboard:
- ✅ **Application Status Breakdown**: pending, interviewing, accepted, completed, etc.
- ✅ **Recent Projects**: Latest projects available to apply
- ✅ **Ongoing Work**: Accepted applications currently in progress
- ✅ **Completed Projects**: History of finished work
- ✅ **Gig Performance**: User's gigs with stats
- ✅ **Interaction Metrics**: Saved, liked, disliked projects
- ✅ **Earnings Tracking**: Total earnings from completed projects
- ✅ **Quick Actions**: Browse projects, applications, create gigs

### Client Dashboard:
- ✅ **Project Status Overview**: draft, active, in_progress, completed
- ✅ **Posted Projects**: Client's projects with performance stats
- ✅ **Latest Applications**: Recent applications received
- ✅ **Active Projects**: Ongoing work with assigned freelancers
- ✅ **Completed Projects**: Project history
- ✅ **Available Gigs**: Latest gigs for potential hiring
- ✅ **Spending Analytics**: Total money spent on projects
- ✅ **Quick Actions**: Post project, browse freelancers

---

## 🚨 ERROR HANDLING

### Common Error Responses:
```javascript
// 400 - Bad Request
{
  "statusCode": 400,
  "message": "User ID not found",
  "success": false
}

// 401 - Unauthorized
{
  "statusCode": 401,
  "message": "Access token is required",
  "success": false
}

// 403 - Forbidden
{
  "statusCode": 403,
  "message": "Invalid user role for dashboard access",
  "success": false
}

// 500 - Server Error
{
  "statusCode": 500,
  "message": "Failed to retrieve dashboard data: [error details]",
  "success": false
}
```

---

## 📱 UI/UX SUGGESTIONS

### 1. Dashboard Layout:
- ✅ Role-based UI (different for freelancer vs client)
- ✅ Quick stats cards at the top
- ✅ Recent activity sections
- ✅ Quick action buttons
- ✅ Performance charts/graphs

### 2. Real-time Features:
- ✅ Auto-refresh stats every 5 minutes
- ✅ Live notification for new applications
- ✅ Progress indicators for ongoing projects
- ✅ Earnings/spending trackers

### 3. Responsive Design:
- ✅ Mobile-optimized cards
- ✅ Collapsible sections
- ✅ Touch-friendly quick actions
- ✅ Progressive loading

---

## 🔗 INTEGRATION CHECKLIST

### Backend Setup:
- [x] Dashboard controller implemented
- [x] Role-based logic for freelancer/client
- [x] Routes defined (`/api/v1/dashboard/*`)
- [x] Added to main app.js
- [x] Comprehensive error handling

### Frontend Setup:
- [ ] Dashboard hook implementation
- [ ] Role-based components (FreelancerDashboard, ClientDashboard)
- [ ] Stats cards and visualizations
- [ ] Quick action buttons
- [ ] Auto-refresh mechanisms
- [ ] Loading states and skeletons
- [ ] Error handling and fallbacks

### Key Features:
- [x] Complete role separation
- [x] Rich application/project statistics
- [x] Recent activity feeds
- [x] Earnings/spending tracking
- [x] Interaction metrics
- [x] Performance insights
- [x] Quick navigation actions

This dashboard implementation provides comprehensive, role-based insights that help both freelancers and clients manage their activities effectively! 🚀
