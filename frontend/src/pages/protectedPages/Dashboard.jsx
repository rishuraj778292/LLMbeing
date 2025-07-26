import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    DollarSign,
    Briefcase,
    Star,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertCircle,
    Users,
    FileText,
    Calendar,
    ArrowRight,
    Plus,
    Eye,
    Bookmark
} from 'lucide-react';
import { fetchOwnProjects } from '../../../Redux/Slice/projectSlice';
import { getUserApplications, getClientApplications } from '../../../Redux/Slice/applicationSlice';
import { fetchSavedProjects } from '../../../Redux/Slice/savedProjectSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user, verifyStatus } = useSelector(state => state.auth);
    const { ownProjects } = useSelector(state => state.projects);
    const applicationState = useSelector(state => state.applications);
    const { userApplications = [], clientApplications = [] } = applicationState || {};
    const { total: savedProjectsCount } = useSelector(state => state.savedProjects);

    const [dashboardStats, setDashboardStats] = useState({
        totalEarnings: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingApplications: 0,
        successRate: 0,
        avgRating: 0
    });

    useEffect(() => {
        if (!user) return;

        // Add a small delay to prevent infinite re-renders
        const timeoutId = setTimeout(() => {
            let stats = {
                totalEarnings: 0,
                activeProjects: 0,
                completedProjects: 0,
                pendingApplications: 0,
                successRate: 0,
                avgRating: 0
            };

            if (user.role === 'client') {
                // Client statistics
                const projects = ownProjects || [];
                stats.activeProjects = projects.filter(p => p.projectStatus === 'active').length;
                stats.completedProjects = projects.filter(p => p.projectStatus === 'completed').length;
                stats.pendingApplications = (clientApplications || []).filter(a => a.status === 'pending').length;

                // Calculate total spent
                stats.totalEarnings = projects
                    .filter(p => p.projectStatus === 'completed')
                    .reduce((total, project) => {
                        const budget = project.budget;
                        if (typeof budget === 'object') {
                            return total + (budget.max || budget.min || 0);
                        }
                        return total + (budget || 0);
                    }, 0);
            } else if (user.role === 'freelancer') {
                // Freelancer statistics
                const applications = userApplications || [];
                const acceptedApps = applications.filter(a => a.status === 'accepted');
                const completedApps = applications.filter(a => a.status === 'completed');

                stats.activeProjects = acceptedApps.length;
                stats.completedProjects = completedApps.length;
                stats.pendingApplications = applications.filter(a => a.status === 'pending').length;

                // Calculate success rate
                if (applications.length > 0) {
                    stats.successRate = Math.round((acceptedApps.length / applications.length) * 100);
                }

                // Calculate total earnings
                stats.totalEarnings = completedApps.reduce((total, app) => {
                    return total + (app.proposedBudget || 0);
                }, 0);
            }

            setDashboardStats(stats);
        }, 100);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.role, ownProjects?.length, userApplications?.length, clientApplications?.length]);

    useEffect(() => {
        if (user) {
            // Fetch saved projects count for all users
            dispatch(fetchSavedProjects({ page: 1, limit: 1 })); // Just to get the total count

            // Fetch user's projects if they're a client
            if (user.role === 'client') {
                dispatch(fetchOwnProjects());
                dispatch(getClientApplications());
            }

            // Fetch user's applications if they're a freelancer
            if (user.role === 'freelancer') {
                dispatch(getUserApplications());
            }
        }
    }, [dispatch, user]);

    // eslint-disable-next-line no-unused-vars
    const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className={`inline-flex items-center justify-center p-2 bg-${color}-100 rounded-lg`}>
                        <Icon className={`h-6 w-6 text-${color}-600`} />
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );

    const RecentActivity = () => {
        const activities = [];

        if (user?.role === 'client' && clientApplications) {
            clientApplications.slice(0, 5).forEach(app => {
                activities.push({
                    id: app._id,
                    type: 'application',
                    title: `New application for ${app.project?.title}`,
                    subtitle: `By ${app.freelancer?.fullName}`,
                    time: new Date(app.createdAt).toLocaleDateString(),
                    status: app.status,
                    link: `/projects/${app.project?.slug}`
                });
            });
        } else if (user?.role === 'freelancer' && userApplications) {
            userApplications.slice(0, 5).forEach(app => {
                activities.push({
                    id: app._id,
                    type: 'application',
                    title: `Application ${app.status}`,
                    subtitle: app.project?.title,
                    time: new Date(app.updatedAt).toLocaleDateString(),
                    status: app.status,
                    link: `/projects/${app.project?.slug}`
                });
            });
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                    {activities.length > 0 ? (
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-2 h-2 rounded-full ${activity.status === 'accepted' ? 'bg-green-500' :
                                            activity.status === 'rejected' ? 'bg-red-500' :
                                                activity.status === 'pending' ? 'bg-yellow-500' :
                                                    'bg-gray-500'
                                            }`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                                            <p className="text-xs text-gray-500">{activity.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500">{activity.time}</span>
                                        {activity.link && (
                                            <Link to={activity.link} className="text-blue-600 hover:text-blue-700">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const QuickActions = () => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 gap-4">
                    {user?.role === 'client' ? (
                        <>
                            <Link
                                to="/post-project"
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Plus className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">Post New Project</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                            </Link>
                            <Link
                                to="/manage-projects"
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Briefcase className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-gray-900">Manage Projects</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/projects"
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <Briefcase className="h-5 w-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">Find Projects</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                            </Link>
                            <Link
                                to="/manage-projects"
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-green-600" />
                                    <span className="font-medium text-gray-900">My Applications</span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-gray-400" />
                            </Link>
                        </>
                    )}
                    <Link
                        to="/manage-projects/saved"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <Bookmark className="h-5 w-5 text-indigo-600" />
                            <span className="font-medium text-gray-900">Saved Projects</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </Link>
                    <Link
                        to="/profile"
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-3">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="font-medium text-gray-900">Edit Profile</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                    </Link>
                </div>
            </div>
        </div>
    );


    // Debug logs for authentication state
    console.log('Dashboard user:', user);
    console.log('Dashboard verifyStatus:', verifyStatus);

    if (verifyStatus === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (verifyStatus === 'failed') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600 text-xl">Failed to load user data. Please try logging in again.</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600 text-xl">No user data found. Please log in.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user.fullName}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {user.role === 'client'
                            ? 'Manage your projects and find talented freelancers'
                            : 'Find amazing projects and grow your freelance career'
                        }
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={DollarSign}
                        title={user.role === 'client' ? 'Total Spent' : 'Total Earned'}
                        value={`$${dashboardStats.totalEarnings.toLocaleString()}`}
                        color="green"
                    />
                    <StatCard
                        icon={Briefcase}
                        title="Active Projects"
                        value={dashboardStats.activeProjects}
                        color="blue"
                    />
                    <StatCard
                        icon={CheckCircle}
                        title="Completed Projects"
                        value={dashboardStats.completedProjects}
                        color="purple"
                    />
                    <StatCard
                        icon={AlertCircle}
                        title={user.role === 'client' ? 'Pending Applications' : 'Pending Applications'}
                        value={dashboardStats.pendingApplications}
                        color="yellow"
                    />
                    <StatCard
                        icon={Bookmark}
                        title="Saved Projects"
                        value={savedProjectsCount || 0}
                        color="indigo"
                    />
                </div>

                {/* Additional Stats for Freelancers */}
                {user.role === 'freelancer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <StatCard
                            icon={TrendingUp}
                            title="Success Rate"
                            value={`${dashboardStats.successRate}%`}
                            subtitle="Application acceptance rate"
                            color="green"
                        />
                        <StatCard
                            icon={Star}
                            title="Average Rating"
                            value={dashboardStats.avgRating || 'N/A'}
                            subtitle="Based on client reviews"
                            color="yellow"
                        />
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2">
                        <RecentActivity />
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// import React, { useEffect, useState, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import {
//     BarChart3,
//     DollarSign,
//     Briefcase,
//     Star,
//     TrendingUp,
//     Clock,
//     CheckCircle,
//     AlertCircle,
//     Users,
//     FileText,
//     Calendar,
//     ArrowRight,
//     Plus,
//     Eye,
//     Bookmark,
//     Activity,
//     Award,
//     Target,
//     Zap,
//     ChevronRight,
//     ExternalLink,
//     Filter,
//     MoreHorizontal
// } from 'lucide-react';
// import { fetchOwnProjects } from '../../../Redux/Slice/projectSlice';
// import { getUserApplications, getClientApplications } from '../../../Redux/Slice/applicationSlice';
// import { fetchSavedProjects } from '../../../Redux/Slice/savedProjectSlice';

// const Dashboard = () => {
//     const dispatch = useDispatch();
//     const { user, verifyStatus } = useSelector(state => state.auth);
//     const { ownProjects } = useSelector(state => state.projects);
//     const applicationState = useSelector(state => state.applications);
//     const { userApplications = [], clientApplications = [] } = applicationState || {};
//     const { total: savedProjectsCount } = useSelector(state => state.savedProjects);

//     const [dashboardStats, setDashboardStats] = useState({
//         totalEarnings: 0,
//         activeProjects: 0,
//         completedProjects: 0,
//         pendingApplications: 0,
//         successRate: 0,
//         avgRating: 0
//     });

//     const [selectedTimeframe, setSelectedTimeframe] = useState('all');

//     // Memoized stats calculation for better performance
//     const calculatedStats = useMemo(() => {
//         if (!user) return dashboardStats;

//         let stats = {
//             totalEarnings: 0,
//             activeProjects: 0,
//             completedProjects: 0,
//             pendingApplications: 0,
//             successRate: 0,
//             avgRating: 0
//         };

//         if (user.role === 'client') {
//             const projects = ownProjects || [];
//             stats.activeProjects = projects.filter(p => p.projectStatus === 'active').length;
//             stats.completedProjects = projects.filter(p => p.projectStatus === 'completed').length;
//             stats.pendingApplications = (clientApplications || []).filter(a => a.status === 'pending').length;

//             stats.totalEarnings = projects
//                 .filter(p => p.projectStatus === 'completed')
//                 .reduce((total, project) => {
//                     const budget = project.budget;
//                     if (typeof budget === 'object') {
//                         return total + (budget.max || budget.min || 0);
//                     }
//                     return total + (budget || 0);
//                 }, 0);
//         } else if (user.role === 'freelancer') {
//             const applications = userApplications || [];
//             const acceptedApps = applications.filter(a => a.status === 'accepted');
//             const completedApps = applications.filter(a => a.status === 'completed');

//             stats.activeProjects = acceptedApps.length;
//             stats.completedProjects = completedApps.length;
//             stats.pendingApplications = applications.filter(a => a.status === 'pending').length;

//             if (applications.length > 0) {
//                 stats.successRate = Math.round((acceptedApps.length / applications.length) * 100);
//             }

//             stats.totalEarnings = completedApps.reduce((total, app) => {
//                 return total + (app.proposedBudget || 0);
//             }, 0);
//         }

//         return stats;
//     }, [user, ownProjects, userApplications, clientApplications]);

//     useEffect(() => {
//         setDashboardStats(calculatedStats);
//     }, [calculatedStats]);

//     useEffect(() => {
//         if (user) {
//             dispatch(fetchSavedProjects({ page: 1, limit: 1 }));

//             if (user.role === 'client') {
//                 dispatch(fetchOwnProjects());
//                 dispatch(getClientApplications());
//             }

//             if (user.role === 'freelancer') {
//                 dispatch(getUserApplications());
//             }
//         }
//     }, [dispatch, user]);

//     // Enhanced StatCard with better visual hierarchy and micro-interactions
//     const StatCard = ({ 
//         icon: Icon, 
//         title, 
//         value, 
//         subtitle, 
//         color = 'blue', 
//         trend = null, 
//         trendDirection = 'up',
//         onClick = null,
//         isClickable = false
//     }) => (
//         <div 
//             className={`group relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${isClickable ? 'cursor-pointer' : ''}`}
//             onClick={onClick}
//         >
//             <div className="flex items-start justify-between">
//                 <div className={`inline-flex items-center justify-center p-3 bg-${color}-50 rounded-xl border border-${color}-100`}>
//                     <Icon className={`h-6 w-6 text-${color}-600`} />
//                 </div>
//                 {trend && (
//                     <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
//                         trendDirection === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
//                     }`}>
//                         <TrendingUp className={`h-3 w-3 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
//                         <span>{trend}</span>
//                     </div>
//                 )}
//             </div>
//             <div className="mt-4">
//                 <h3 className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
//                     {value}
//                 </h3>
//                 <p className="text-sm font-medium text-gray-600 mt-1">{title}</p>
//                 {subtitle && (
//                     <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subtitle}</p>
//                 )}
//             </div>
//             {isClickable && (
//                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
//                     <ExternalLink className="h-4 w-4 text-gray-400" />
//                 </div>
//             )}
//         </div>
//     );

//     // Enhanced Recent Activity with better UX
//     const RecentActivity = () => {
//         const activities = [];

//         if (user?.role === 'client' && clientApplications) {
//             clientApplications.slice(0, 8).forEach(app => {
//                 activities.push({
//                     id: app._id,
//                     type: 'application',
//                     title: `New application received`,
//                     subtitle: `${app.freelancer?.fullName} applied for "${app.project?.title}"`,
//                     time: new Date(app.createdAt).toLocaleDateString(),
//                     timeAgo: getTimeAgo(app.createdAt),
//                     status: app.status,
//                     link: `/projects/${app.project?.slug}`,
//                     priority: app.status === 'pending' ? 'high' : 'normal'
//                 });
//             });
//         } else if (user?.role === 'freelancer' && userApplications) {
//             userApplications.slice(0, 8).forEach(app => {
//                 activities.push({
//                     id: app._id,
//                     type: 'application',
//                     title: `Application ${app.status}`,
//                     subtitle: `For project: "${app.project?.title}"`,
//                     time: new Date(app.updatedAt).toLocaleDateString(),
//                     timeAgo: getTimeAgo(app.updatedAt),
//                     status: app.status,
//                     link: `/projects/${app.project?.slug}`,
//                     priority: app.status === 'accepted' ? 'high' : 'normal'
//                 });
//             });
//         }

//         const getStatusConfig = (status) => {
//             const configs = {
//                 accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
//                 rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
//                 pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
//                 completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Award }
//             };
//             return configs[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Activity };
//         };

//         return (
//             <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                 <div className="p-6 border-b border-gray-100">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                             <Activity className="h-5 w-5 text-gray-600" />
//                             <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                             <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                                 <Filter className="h-4 w-4 text-gray-500" />
//                             </button>
//                             <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                                 <MoreHorizontal className="h-4 w-4 text-gray-500" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="p-6">
//                     {activities.length > 0 ? (
//                         <div className="space-y-4">
//                             {activities.map((activity) => {
//                                 const statusConfig = getStatusConfig(activity.status);
//                                 const StatusIcon = statusConfig.icon;
                                
//                                 return (
//                                     <div key={activity.id} className="group flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
//                                         <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center ${statusConfig.color}`}>
//                                             <StatusIcon className="h-4 w-4" />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="flex items-start justify-between">
//                                                 <div className="flex-1">
//                                                     <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
//                                                         {activity.title}
//                                                     </p>
//                                                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                                                         {activity.subtitle}
//                                                     </p>
//                                                     <div className="flex items-center space-x-2 mt-2">
//                                                         <span className="text-xs text-gray-500">{activity.timeAgo}</span>
//                                                         {activity.priority === 'high' && (
//                                                             <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
//                                                                 Priority
//                                                             </span>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                                 {activity.link && (
//                                                     <Link 
//                                                         to={activity.link} 
//                                                         className="flex-shrink-0 p-1 text-gray-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
//                                                     >
//                                                         <ChevronRight className="h-4 w-4" />
//                                                     </Link>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12">
//                             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                 <Clock className="h-8 w-8 text-gray-400" />
//                             </div>
//                             <h4 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h4>
//                             <p className="text-sm text-gray-500">Your activity will appear here once you start working</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         );
//     };

//     // Enhanced Quick Actions with better categorization
//     const QuickActions = () => {
//         const primaryActions = user?.role === 'client' ? [
//             {
//                 to: "/post-project",
//                 icon: Plus,
//                 title: "Post New Project",
//                 subtitle: "Find the perfect freelancer",
//                 color: "blue",
//                 primary: true
//             },
//             {
//                 to: "/manage-projects",
//                 icon: Briefcase,
//                 title: "Manage Projects",
//                 subtitle: "Track project progress",
//                 color: "green"
//             }
//         ] : [
//             {
//                 to: "/projects",
//                 icon: Target,
//                 title: "Find Projects",
//                 subtitle: "Discover opportunities",
//                 color: "blue",
//                 primary: true
//             },
//             {
//                 to: "/manage-projects",
//                 icon: FileText,
//                 title: "My Applications",
//                 subtitle: "Track application status",
//                 color: "green"
//             }
//         ];

//         const secondaryActions = [
//             {
//                 to: "/manage-projects/saved",
//                 icon: Bookmark,
//                 title: "Saved Projects",
//                 subtitle: "Your bookmarked opportunities",
//                 color: "indigo"
//             },
//             {
//                 to: "/profile",
//                 icon: Users,
//                 title: "Edit Profile",
//                 subtitle: "Update your information",
//                 color: "purple"
//             }
//         ];

//         const ActionCard = ({ to, icon: Icon, title, subtitle, color, primary = false }) => (
//             <Link
//                 to={to}
//                 className={`group relative flex items-center space-x-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
//                     primary 
//                         ? `bg-${color}-50 border-${color}-200 hover:bg-${color}-100` 
//                         : 'bg-white border-gray-200 hover:bg-gray-50'
//                 }`}
//             >
//                 <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
//                     primary ? `bg-${color}-100` : `bg-${color}-50`
//                 }`}>
//                     <Icon className={`h-5 w-5 text-${color}-600`} />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                     <h4 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
//                         {title}
//                     </h4>
//                     <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
//                 </div>
//                 <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
//             </Link>
//         );

//         return (
//             <div className="space-y-6">
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                     <div className="p-6 border-b border-gray-100">
//                         <div className="flex items-center space-x-3">
//                             <Zap className="h-5 w-5 text-gray-600" />
//                             <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
//                         </div>
//                     </div>
//                     <div className="p-6">
//                         <div className="space-y-3">
//                             {primaryActions.map((action, index) => (
//                                 <ActionCard key={index} {...action} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-xl shadow-sm border border-gray-100">
//                     <div className="p-6 border-b border-gray-100">
//                         <h3 className="text-sm font-medium text-gray-700">More Actions</h3>
//                     </div>
//                     <div className="p-6">
//                         <div className="space-y-3">
//                             {secondaryActions.map((action, index) => (
//                                 <ActionCard key={index} {...action} />
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // Helper function for time ago calculation
//     const getTimeAgo = (dateString) => {
//         const date = new Date(dateString);
//         const now = new Date();
//         const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
//         if (diffInMinutes < 1) return 'Just now';
//         if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//         if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//         return `${Math.floor(diffInMinutes / 1440)}d ago`;
//     };

//     // Loading and error states with better UX
//     if (verifyStatus === 'loading') {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
//                         <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard</h3>
//                     <p className="text-sm text-gray-600">Please wait while we prepare your workspace...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (verifyStatus === 'failed') {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
//                         <AlertCircle className="h-8 w-8 text-red-600" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Failed</h3>
//                     <p className="text-sm text-gray-600 mb-4">We couldn't verify your identity. Please try logging in again.</p>
//                     <Link to="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                         Return to Login
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
//                         <Users className="h-8 w-8 text-gray-600" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">No User Data</h3>
//                     <p className="text-sm text-gray-600 mb-4">Please log in to access your dashboard.</p>
//                     <Link to="/login" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                         Go to Login
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Enhanced Header */}
//                 <div className="mb-8">
//                     <div className="flex items-start justify-between">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                                 Welcome back, {user.fullName}
//                             </h1>
//                             <p className="text-gray-600 text-lg">
//                                 {user.role === 'client'
//                                     ? 'Manage your projects and find talented freelancers'
//                                     : 'Find amazing projects and grow your freelance career'
//                                 }
//                             </p>
//                         </div>
//                         <div className="flex items-center space-x-3">
//                             <select 
//                                 value={selectedTimeframe}
//                                 onChange={(e) => setSelectedTimeframe(e.target.value)}
//                                 className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="all">All Time</option>
//                                 <option value="30d">Last 30 Days</option>
//                                 <option value="7d">Last 7 Days</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Primary Stats Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
//                     <StatCard
//                         icon={DollarSign}
//                         title={user.role === 'client' ? 'Total Spent' : 'Total Earned'}
//                         value={`$${dashboardStats.totalEarnings.toLocaleString()}`}
//                         color="green"
//                         trend="12%"
//                         trendDirection="up"
//                     />
//                     <StatCard
//                         icon={Briefcase}
//                         title="Active Projects"
//                         value={dashboardStats.activeProjects}
//                         color="blue"
//                         isClickable={true}
//                     />
//                     <StatCard
//                         icon={CheckCircle}
//                         title="Completed Projects"
//                         value={dashboardStats.completedProjects}
//                         color="purple"
//                         trend="5%"
//                         trendDirection="up"
//                     />
//                     <StatCard
//                         icon={AlertCircle}
//                         title={user.role === 'client' ? 'Pending Applications' : 'Pending Applications'}
//                         value={dashboardStats.pendingApplications}
//                         color="yellow"
//                     />
//                     <StatCard
//                         icon={Bookmark}
//                         title="Saved Projects"
//                         value={savedProjectsCount || 0}
//                         color="indigo"
//                     />
//                 </div>

//                 {/* Freelancer-specific stats */}
//                 {user.role === 'freelancer' && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                         <StatCard
//                             icon={TrendingUp}
//                             title="Success Rate"
//                             value={`${dashboardStats.successRate}%`}
//                             subtitle="Application acceptance rate"
//                             color="green"
//                             trend="3%"
//                             trendDirection="up"
//                         />
//                         <StatCard
//                             icon={Star}
//                             title="Average Rating"
//                             value={dashboardStats.avgRating || 'N/A'}
//                             subtitle="Based on client reviews"
//                             color="yellow"
//                         />
//                     </div>
//                 )}

//                 {/* Main Content Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Recent Activity - Takes more space */}
//                     <div className="lg:col-span-2">
//                         <RecentActivity />
//                     </div>

//                     {/* Quick Actions Sidebar */}
//                     <div>
//                         <QuickActions />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;