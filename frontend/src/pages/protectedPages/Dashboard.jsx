import React, { useEffect, useState, useCallback } from 'react';
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
    Eye
} from 'lucide-react';
import { fetchOwnProjects } from '../../../Redux/Slice/projectSlice';
import { getUserApplications, getClientApplications } from '../../../Redux/Slice/applicationSlice';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { ownProjects } = useSelector(state => state.projects);
    const applicationState = useSelector(state => state.application);
    const { userApplications = [], clientApplications = [] } = applicationState || {};

    const [dashboardStats, setDashboardStats] = useState({
        totalEarnings: 0,
        activeProjects: 0,
        completedProjects: 0,
        pendingApplications: 0,
        successRate: 0,
        avgRating: 0
    });

    const calculateStats = useCallback(() => {
        if (!user) return;

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
    }, [user, ownProjects, userApplications, clientApplications]);

    useEffect(() => {
        if (user) {
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

    useEffect(() => {
        // Calculate dashboard statistics
        calculateStats();
    }, [calculateStats]);

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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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