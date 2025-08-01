import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Clock, Filter, Search, Calendar, User, DollarSign,
    Check, X, MessageCircle, Eye, FileText, ChevronDown,
    MoreHorizontal, ExternalLink, Download, CheckCircle
} from 'lucide-react';
import { getClientApplications, acceptApplication, rejectApplication } from '../../../../Redux/Slice/applicationSlice';
import { createChatRoom } from '../../../../Redux/Slice/messageSlice';

const ManageApplications = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [projectFilter, setProjectFilter] = useState('all');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { clientApplications, status } = useSelector((state) => state.applications);
    const { projects } = useSelector((state) => state.projects);

    useEffect(() => {
        // Check if user is a client and fetch their applications
        if (user && user.role === 'client') {
            dispatch(getClientApplications());
        } else if (user && user.role !== 'client') {
            // Redirect non-client users
            navigate('/dashboard');
        }
    }, [dispatch, user, navigate]);

    // Format budget function
    const formatBudget = (budget) => {
        if (!budget) return "Not specified";

        if (typeof budget === 'object') {
            if (budget.hourlyRate) {
                const { min, max } = budget.hourlyRate;
                if (min && max) {
                    return `$${min.toLocaleString()}-$${max.toLocaleString()}/hr`;
                } else if (min) {
                    return `$${min.toLocaleString()}+/hr`;
                }
                return "Hourly rate";
            }

            if (budget.min !== undefined || budget.max !== undefined) {
                if (budget.min && budget.max) {
                    return `$${budget.min.toLocaleString()}-$${budget.max.toLocaleString()}`;
                } else if (budget.min) {
                    return `$${budget.min.toLocaleString()}+`;
                } else if (budget.max) {
                    return `Up to $${budget.max.toLocaleString()}`;
                }
            }
            return "Budget not specified";
        }

        const numericBudget = typeof budget === 'number' ? budget : parseFloat(budget);
        if (isNaN(numericBudget)) return budget;
        return `$${numericBudget.toLocaleString()}`;
    };

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const closeAllDropdowns = () => {
        setActiveDropdown(null);
    };

    const handleActionClick = (action, applicationId, data = {}) => {
        setConfirmAction({
            type: action,
            applicationId,
            data
        });
        closeAllDropdowns();
    };

    const handleCancelAction = () => {
        setConfirmAction(null);
    };

    const handleMessageFreelancer = async (projectId, freelancerId) => {
        try {
            // Create or get existing chat room
            const resultAction = await dispatch(createChatRoom({ projectId, freelancerId })).unwrap();

            // Navigate to the messages page with the new room ID
            navigate('/messages', { state: { selectedChatId: resultAction._id } });
        } catch (error) {
            console.error('Failed to create chat room:', error);
            alert('Failed to start conversation. Please try again later.');
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;

        const { type, applicationId, data } = confirmAction;
        setActionLoading(true);

        try {
            if (type === 'accept') {
                await dispatch(acceptApplication({ applicationId, acceptanceData: data })).unwrap();
            } else if (type === 'reject') {
                await dispatch(rejectApplication({ applicationId, rejectionData: data })).unwrap();
            }
            setConfirmAction(null);
        } catch (error) {
            console.error(`Failed to ${type} application:`, error);
        } finally {
            setActionLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'interviewing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            case 'withdrawn': return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'completed': return 'bg-purple-50 text-purple-700 border-purple-200';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'interviewing': return <MessageCircle className="w-4 h-4" />;
            case 'accepted': return <Check className="w-4 h-4" />;
            case 'rejected': return <X className="w-4 h-4" />;
            case 'withdrawn': return <X className="w-4 h-4" />;
            case 'completed': return <CheckCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    // Get unique projects from applications
    const uniqueProjects = clientApplications && Array.isArray(clientApplications)
        ? [...new Map(clientApplications.map(app => [app.project?._id, app.project])).values()].filter(Boolean)
        : [];

    // Filter applications based on search and filters
    const filteredApplications = clientApplications && Array.isArray(clientApplications)
        ? clientApplications.filter(application => {
            const freelancer = application.freelancer || {};
            const project = application.project || {};

            const matchesSearch =
                freelancer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.coverLetter?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
            const matchesProject = projectFilter === 'all' || application.project?._id === projectFilter;

            return matchesSearch && matchesStatus && matchesProject;
        })
        : [];

    // Get counts for status filter
    const getStatusCounts = () => {
        const counts = { all: 0 };
        if (clientApplications && Array.isArray(clientApplications)) {
            counts.all = clientApplications.length;
            clientApplications.forEach(app => {
                counts[app.status] = (counts[app.status] || 0) + 1;
            });
        }
        return counts;
    };

    const statusCounts = getStatusCounts();

    const statusOptions = [
        { value: 'all', label: 'All Applications' },
        { value: 'pending', label: 'Pending' },
        { value: 'interviewing', label: 'Interviewing' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'withdrawn', label: 'Withdrawn' },
        { value: 'completed', label: 'Completed' }
    ].filter(option => statusCounts[option.value] > 0);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Manage Applications</h1>
                            <p className="text-gray-600">Review and respond to freelancer applications</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                                {filteredApplications.length} of {clientApplications?.length || 0} applications
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {statusOptions.slice(1, 5).map((status) => (
                        <div key={status.value} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className={`p-2 rounded-lg ${getStatusColor(status.value).replace('border-', 'bg-').replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                                    {getStatusIcon(status.value)}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{status.label}</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{statusCounts[status.value] || 0}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by freelancer or project..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label} ({statusCounts[option.value] || 0})
                                    </option>
                                ))}
                            </select>

                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Projects</option>
                                {uniqueProjects.map((project) => (
                                    <option key={project._id} value={project._id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {filteredApplications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredApplications.map((application) => {
                            const freelancer = application.freelancer || {};
                            const project = application.project || {};

                            return (
                                <div key={application._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* Main Content */}
                                        <div className="flex-1">
                                            {/* Header with Status Badge */}
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                                                        {project.title || 'Untitled Project'}
                                                    </h3>
                                                    <div className="flex items-center mt-1 text-gray-600 text-sm">
                                                        <User className="h-4 w-4 mr-1 text-gray-400" />
                                                        <span className="font-medium">{freelancer.fullName || 'Unknown Freelancer'}</span>
                                                        <span className="mx-2 text-gray-300">•</span>
                                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                        <span>{new Date(application.appliedAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>

                                                <span className={`px-3 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(application.status)}`}>
                                                    {getStatusIcon(application.status)}
                                                    <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                                                </span>
                                            </div>

                                            {/* Cover Letter Excerpt */}
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h4>
                                                <p className="text-gray-700 text-sm line-clamp-3">{application.coverLetter}</p>
                                                {application.coverLetter && application.coverLetter.length > 300 && (
                                                    <button
                                                        onClick={() => navigate(`/applications/${application._id}`)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm mt-1 font-medium"
                                                    >
                                                        Read more
                                                    </button>
                                                )}
                                            </div>

                                            {/* Application Details */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Project Budget</p>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-sm font-semibold text-green-600">{formatBudget(project.budget)}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Freelancer's Proposal</p>
                                                    <div className="flex items-center space-x-1">
                                                        <span className="text-sm font-semibold text-blue-600">${application.proposedBudget?.toLocaleString() || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Expected Delivery</p>
                                                    <span className="text-sm font-medium text-gray-900">{application.expectedDelivery} days</span>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-xs text-gray-500 mb-1">Attachments</p>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {application.attachments?.length || 0} file(s)
                                                        {application.attachments?.length > 0 && (
                                                            <button
                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                                title="View attachments"
                                                            >
                                                                <Download className="w-4 h-4 inline" />
                                                            </button>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-row lg:flex-col gap-3 lg:items-end min-w-[140px]">
                                            {/* Message button */}
                                            <button
                                                onClick={() => handleMessageFreelancer(application.project._id, application.freelancer._id)}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span>Message</span>
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() => toggleDropdown(application._id)}
                                                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer w-full justify-center"
                                                >
                                                    <span>Actions</span>
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>

                                                {activeDropdown === application._id && (
                                                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => navigate(`/applications/${application._id}`)}
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" /> View Details
                                                            </button>

                                                            {/* Show Accept only for pending applications */}
                                                            {application.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleActionClick('accept', application._id)}
                                                                    className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 w-full text-left"
                                                                >
                                                                    <Check className="w-4 h-4 mr-2" /> Accept Application
                                                                </button>
                                                            )}

                                                            {/* Show Interview for pending applications */}
                                                            {application.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleMessageFreelancer(application.project._id, application.freelancer._id)}
                                                                    className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full text-left"
                                                                >
                                                                    <MessageCircle className="w-4 h-4 mr-2" /> Message Freelancer
                                                                </button>
                                                            )}

                                                            {/* Show Reject for pending/interviewing applications */}
                                                            {['pending', 'interviewing'].includes(application.status) && (
                                                                <button
                                                                    onClick={() => handleActionClick('reject', application._id)}
                                                                    className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                                                                >
                                                                    <X className="w-4 h-4 mr-2" /> Reject Application
                                                                </button>
                                                            )}

                                                            {/* Show View Profile for all statuses */}
                                                            <button
                                                                onClick={() => navigate(`/profile/${freelancer._id}`)}
                                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                            >
                                                                <User className="w-4 h-4 mr-2" /> View Freelancer Profile
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Quick action buttons based on status */}
                                            {application.status === 'pending' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleActionClick('accept', application._id)}
                                                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                        title="Accept"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick('reject', application._id)}
                                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="text-center py-16 px-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No applications found</h3>
                            <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
                                {searchTerm || statusFilter !== 'all' || projectFilter !== 'all'
                                    ? "No applications match your current filters. Try adjusting your search criteria or clear filters to see all applications."
                                    : "You haven't received any applications yet. Make sure your projects are active and visible to attract qualified freelancers!"
                                }
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {(searchTerm || statusFilter !== 'all' || projectFilter !== 'all') ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                            setProjectFilter('all');
                                        }}
                                        className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        Clear filters
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate('/projects/new')}
                                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                                    >
                                        Post a New Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Action Modal */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex items-center mb-4">
                            {confirmAction.type === 'accept' ? (
                                <>
                                    <Check className="w-6 h-6 mr-2 text-green-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Accept Application</h3>
                                </>
                            ) : confirmAction.type === 'reject' ? (
                                <>
                                    <X className="w-6 h-6 mr-2 text-red-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Reject Application</h3>
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                                    <h3 className="text-xl font-bold text-gray-900">Message Freelancer</h3>
                                </>
                            )}
                        </div>

                        <p className="text-gray-700 mb-6">
                            {confirmAction.type === 'accept'
                                ? "Are you sure you want to accept this application? This will notify the freelancer and start the project."
                                : confirmAction.type === 'reject'
                                    ? "Are you sure you want to reject this application? This action cannot be undone."
                                    : "Send a message to the freelancer to discuss the project further."}
                        </p>

                        {confirmAction.type === 'reject' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason for rejection (optional):</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Let the freelancer know why their application was not selected..."
                                    value={confirmAction.data.message || ''}
                                    onChange={(e) => setConfirmAction({ ...confirmAction, data: { ...confirmAction.data, message: e.target.value } })}
                                ></textarea>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleCancelAction}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${confirmAction.type === 'accept'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : confirmAction.type === 'reject'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <span className="mr-2">Processing...</span>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </>
                                ) : (
                                    confirmAction.type === 'accept'
                                        ? 'Accept Application'
                                        : confirmAction.type === 'reject'
                                            ? 'Reject Application'
                                            : 'Send Message'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageApplications;
