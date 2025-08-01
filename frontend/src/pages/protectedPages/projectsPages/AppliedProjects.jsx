import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, MessageCircle, FileText, Filter, Search, Calendar, DollarSign, MapPin, Send, X, AlertTriangle } from 'lucide-react';
import { getUserApplications, withdrawApplication } from '../../../../Redux/Slice/applicationSlice';

const AppliedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userApplications } = useSelector((state) => state.applications);
  const navigate = useNavigate();

  useEffect(() => {
    // Load applications
    console.log('Fetching user applications...');
    dispatch(getUserApplications())
      .then(action => {
        console.log('Applications API response action:', action);
        console.log('Applications API response payload:', action.payload);
      })
      .catch(err => {
        console.error('Error fetching applications:', err);
      });
  }, [dispatch]);

  // Reload applications after a successful withdrawal
  useEffect(() => {
    if (showConfirmModal === false && withdrawLoading === false && withdrawingId) {
      dispatch(getUserApplications());
    }
  }, [showConfirmModal, withdrawLoading, withdrawingId, dispatch]);

  // Log userApplications when they change
  useEffect(() => {
    console.log('User applications state:', userApplications);
    // Log the structure of each application
    if (Array.isArray(userApplications)) {
      userApplications.forEach((app, index) => {
        console.log(`Application ${index}:`, app);
        console.log(`Application ${index} project:`, app.project);
      });
    }
  }, [userApplications]);

  // Format location function
  const formatLocation = (location) => {
    if (!location) return "Remote";

    // Handle new location object structure
    if (typeof location === 'object') {
      if (location.type === 'remote') return "Remote";
      if (location.type === 'onsite' || location.type === 'hybrid') {
        const parts = [];
        if (location.city) parts.push(location.city);
        if (location.country) parts.push(location.country);
        if (parts.length > 0) {
          return `${parts.join(', ')} (${location.type})`;
        }
        return location.type;
      }
      return "Remote";
    }

    // Legacy string format
    return location || "Remote";
  };

  // Format budget function
  const formatBudget = (budget) => {
    if (!budget) return "Not specified";

    // Handle new budget object structure
    if (typeof budget === 'object') {
      // For hourly projects
      if (budget.hourlyRate) {
        const { min, max } = budget.hourlyRate;
        if (min && max) {
          return `$${min.toLocaleString()}-$${max.toLocaleString()}/hr`;
        } else if (min) {
          return `$${min.toLocaleString()}+/hr`;
        }
        return "Hourly rate";
      }

      // For fixed price projects
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

    // Legacy format handling
    const numericBudget = typeof budget === 'number' ? budget : parseFloat(budget);
    if (isNaN(numericBudget)) return budget;
    return `$${numericBudget.toLocaleString()}`;
  };

  // No applied projects currently
  // Using appliedProjects from Redux state

  const handleBrowseProjects = () => {
    navigate('/projects');
  };

  // Handle withdraw application
  const handleWithdrawRequest = (applicationId) => {
    setWithdrawingId(applicationId);
    setShowConfirmModal(true);
  };

  const handleCancelWithdraw = () => {
    setWithdrawingId(null);
    setShowConfirmModal(false);
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawingId) return;

    try {
      setWithdrawLoading(true);
      await dispatch(withdrawApplication(withdrawingId)).unwrap();
      setShowConfirmModal(false);
      setWithdrawingId(null);
    } catch (error) {
      console.error('Failed to withdraw application:', error);
    } finally {
      setWithdrawLoading(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Applications' },
    { value: 'pending', label: 'Pending' },
    { value: 'interviewing', label: 'Interviewing' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'interviewing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'accepted': return 'bg-green-50 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'interviewing': return <MessageCircle className="w-4 h-4" />;
      case 'accepted': return <FileText className="w-4 h-4" />;
      case 'rejected': return <Eye className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProjects = Array.isArray(userApplications) ? userApplications.filter(application => {
    // Skip if application is null or undefined
    if (!application) {
      console.log('Skipping null/undefined application');
      return false;
    }

    const project = application.project;

    // Skip if project is null or undefined
    if (!project) {
      console.log('Skipping application with null/undefined project:', application._id);
      return false;
    }

    // Log the project structure
    console.log('Project in filter:', project);

    // If project is just an ID string or ObjectId
    if (typeof project === 'string' || (project._id && !project.title)) {
      console.log('Project is ID only or missing title:', project);
      // Can't filter by title, but we can still filter by status
      return statusFilter === 'all' || application.status === statusFilter;
    }

    // Normal case with full project object
    const matchesSearch =
      (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.client?.name && project.client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.clientName && project.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;

    console.log(`Application ${application._id} - Matches search: ${matchesSearch}, Matches status: ${matchesStatus}`);

    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusCounts = () => {
    return statusOptions.reduce((acc, option) => {
      if (option.value === 'all') {
        acc[option.value] = userApplications.length;
      } else {
        acc[option.value] = userApplications.filter(application => application.status === option.value).length;
      }
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl  font-bold text-gray-900 mb-2">Applied Projects</h1>
              <p className="text-gray-600">Track your project applications and their status</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                {filteredProjects.length} of {userApplications.length} applications
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statusOptions.slice(1).map((status) => (
            <div key={status.value} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-2">
                <div className={`p-2 rounded-lg ${getStatusColor(status.value).replace('border-', 'bg-').replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                  {getStatusIcon(status.value)}
                </div>
                <span className="text-sm font-medium text-gray-700">{status.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{statusCounts[status.value]}</p>
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({statusCounts[option.value]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {/* Debug Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
          <p>UserApplications length: {userApplications.length}</p>
          <p>Filtered Projects length: {filteredProjects.length}</p>
          <p>Status filter: {statusFilter}</p>
          <p>Search term: {searchTerm || '(none)'}</p>
          <p>User role: {user?.role || 'not set'}</p>
          <p>Auth state: {user ? 'Logged in' : 'Not logged in'}</p>
          <button
            onClick={() => dispatch(getUserApplications())}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh Applications
          </button>

          {userApplications.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">First Application Data:</h4>
              <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(userApplications[0], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((application) => {
              // Get project data with fallbacks
              const project = typeof application.project === 'object' ? application.project : {};
              const projectTitle = project.title || 'Untitled Project';
              const projectDescription = project.description || 'No description available';
              const projectClientName =
                (project.client?.name) ||
                (project.clientName) ||
                'Unknown Client';

              return (
                <div key={application._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                            {projectTitle || 'Untitled Project'}
                          </h3>
                          <p className="text-gray-600 text-sm">by {projectClientName}</p>
                        </div>
                        <span className={`px-3 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                        </span>
                      </div>

                      <p className="text-gray-700 text-sm mb-6 line-clamp-2">{projectDescription || 'No description available'}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Project Budget</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold text-green-600">
                              {typeof project === 'object' ? formatBudget(project.budget) : 'Not specified'}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Your Proposal</p>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold text-blue-600">${application.proposedBudget?.toLocaleString() || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                          <span className="text-sm font-medium text-gray-900">{new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Location</p>
                          <span className="text-sm font-medium text-gray-900">
                            {typeof project === 'object' ? formatLocation(project.location) : 'Remote'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.skillsRequired && Array.isArray(project.skillsRequired) &&
                          project.skillsRequired.map((skill, index) => (
                            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))
                        }
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                        </div>
                        {project.duration && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Duration: {project.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 lg:items-end">
                      {typeof project === 'object' && (project.slug || project._id) && (
                        <button
                          onClick={() => navigate(`/project/${project.slug || project._id}`)}
                          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Project</span>
                        </button>
                      )}

                      {/* Add withdraw button for pending or interviewing applications */}
                      {['pending', 'interviewing'].includes(application.status) && (
                        <button
                          onClick={() => handleWithdrawRequest(application._id)}
                          className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Withdraw</span>
                        </button>
                      )}

                      {application.status === 'interviewing' && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
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
                {searchTerm || statusFilter !== 'all'
                  ? "No applications match your current filters. Try adjusting your search criteria or clear filters to see all applications."
                  : user?.role === 'client'
                    ? "As a client, you can view applications from freelancers on your posted projects. Post a project to start receiving applications!"
                    : "You haven't applied to any projects yet. Start browsing projects to find exciting opportunities that match your skills and expertise!"
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || statusFilter !== 'all') ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Clear filters
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleBrowseProjects}
                      className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      {user?.role === 'client' ? 'Post a Project' : 'Browse Projects'}
                    </button>

                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Withdraw Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center mb-4 text-red-600">
              <AlertTriangle className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Withdraw Application</h3>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to withdraw this application? This action cannot be undone, and you'll need to apply again if you change your mind.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelWithdraw}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={withdrawLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                disabled={withdrawLoading}
              >
                {withdrawLoading ? (
                  <>
                    <span className="mr-2">Withdrawing...</span>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  'Withdraw Application'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedProjects;