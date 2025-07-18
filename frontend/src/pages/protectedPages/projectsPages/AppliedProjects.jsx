import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Clock, Eye, MessageCircle, FileText, Filter, Search, Calendar, DollarSign, MapPin, Send } from 'lucide-react';

const AppliedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // No applied projects currently
  const appliedProjects = [];

  const handleBrowseProjects = () => {
    navigate('/projects');
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

  const filteredProjects = appliedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return statusOptions.reduce((acc, option) => {
      if (option.value === 'all') {
        acc[option.value] = appliedProjects.length;
      } else {
        acc[option.value] = appliedProjects.filter(p => p.status === option.value).length;
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
                {filteredProjects.length} of {appliedProjects.length} applications
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
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 text-sm">by {project.client}</p>
                      </div>
                      <span className={`px-3 py-2 rounded-full text-sm font-medium border flex items-center space-x-2 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Project Budget</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-semibold text-green-600">${project.budget.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Your Proposal</p>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-semibold text-blue-600">${project.proposalAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                        <span className="text-sm font-medium text-gray-900">{new Date(project.appliedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <span className="text-sm font-medium text-gray-900">{project.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.proposalViews} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Last activity: {project.lastActivity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Delivery: {project.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-3 lg:items-end">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer">
                      <FileText className="w-4 h-4" />
                      <span>View Proposal</span>
                    </button>
                    {project.status === 'interviewing' && (
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm cursor-pointer">
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
};

export default AppliedProjects;