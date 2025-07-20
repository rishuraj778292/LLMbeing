import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    DollarSign,
    Calendar,
    FileText,
    Eye,
    Edit2,
    Trash2,
    ExternalLink,
    Filter,
    Search
} from 'lucide-react';
import { 
    getUserApplications, 
    withdrawApplication,
    clearError,
    clearSuccess
} from '../../../Redux/Slice/applicationSlice';

const MyApplications = () => {
    const dispatch = useDispatch();
    const { userApplications, loading, error, success } = useSelector(state => state.applications);
    const { user } = useSelector(state => state.auth);

    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [showWithdrawModal, setShowWithdrawModal] = useState(null);

    useEffect(() => {
        if (user?.role === 'freelancer') {
            dispatch(getUserApplications());
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (userApplications) {
            let filtered = [...userApplications];

            // Filter by status
            if (filters.status !== 'all') {
                filtered = filtered.filter(app => app.status === filters.status);
            }

            // Filter by search term
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filtered = filtered.filter(app => 
                    app.project?.title?.toLowerCase().includes(searchTerm) ||
                    app.project?.description?.toLowerCase().includes(searchTerm) ||
                    app.coverLetter?.toLowerCase().includes(searchTerm)
                );
            }

            setFilteredApplications(filtered);
        }
    }, [userApplications, filters]);

    const handleWithdraw = async (applicationId) => {
        try {
            await dispatch(withdrawApplication(applicationId)).unwrap();
            setShowWithdrawModal(null);
        } catch (err) {
            console.error('Failed to withdraw application:', err);
        }
    };

    const formatBudget = (budget) => {
        if (!budget) return "Not specified";
        return `$${budget.toLocaleString()}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'accepted':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'withdrawn':
                return <AlertTriangle className="h-5 w-5 text-gray-500" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'accepted':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'withdrawn':
                return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'completed':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const canWithdraw = (status) => {
        return ['pending'].includes(status);
    };

    const canEdit = (status) => {
        return ['pending'].includes(status);
    };

    if (user?.role !== 'freelancer') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
                    <p className="text-gray-600 mt-2">Only freelancers can view applications.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Manage your project applications and track their status
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-green-700">{success}</p>
                            <button 
                                onClick={() => dispatch(clearSuccess())}
                                className="ml-auto text-green-500 hover:text-green-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-red-700">{error}</p>
                            <button 
                                onClick={() => dispatch(clearError())}
                                className="ml-auto text-red-500 hover:text-red-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Applications</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="withdrawn">Withdrawn</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Applications
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    placeholder="Search by project title..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-end">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 w-full">
                                <div className="text-sm font-medium text-blue-900">
                                    Total Applications: {userApplications?.length || 0}
                                </div>
                                <div className="text-xs text-blue-700">
                                    Showing: {filteredApplications.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Found</h3>
                        <p className="text-gray-600 mb-4">
                            {filters.status !== 'all' || filters.search 
                                ? 'No applications match your current filters.'
                                : 'You haven\'t applied to any projects yet.'
                            }
                        </p>
                        <Link 
                            to="/find-projects"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            Browse Projects
                            <ExternalLink className="h-4 w-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => (
                            <div key={application._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            {getStatusIcon(application.status)}
                                            <Link 
                                                to={`/project/${application.project?.slug}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                            >
                                                {application.project?.title}
                                            </Link>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-1" />
                                                Proposed: {formatBudget(application.proposedBudget)}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                Delivery: {application.expectedDelivery} days
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="h-4 w-4 mr-1" />
                                                Applied: {formatDate(application.createdAt)}
                                            </div>
                                        </div>

                                        {application.coverLetter && (
                                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                                <p className="text-sm text-gray-700 line-clamp-3">
                                                    {application.coverLetter}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Link 
                                            to={`/project/${application.project?.slug}`}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors inline-flex items-center gap-1"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Project
                                        </Link>
                                        
                                        {canEdit(application.status) && (
                                            <button className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors inline-flex items-center gap-1">
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </button>
                                        )}
                                        
                                        {canWithdraw(application.status) && (
                                            <button 
                                                onClick={() => setShowWithdrawModal(application)}
                                                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors inline-flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Withdraw Confirmation Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">Withdraw Application</h3>
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to withdraw your application for "{showWithdrawModal.project?.title}"? 
                                This action cannot be undone, but you can reapply later.
                            </p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWithdrawModal(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleWithdraw(showWithdrawModal._id)}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Withdrawing...' : 'Withdraw'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyApplications;
