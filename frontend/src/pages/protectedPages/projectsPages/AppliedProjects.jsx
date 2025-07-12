import React, { useState } from 'react';
import { Clock, Eye, MessageCircle, FileText, Filter, Search, Calendar, DollarSign, MapPin } from 'lucide-react';

const AppliedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock applied projects data
  const appliedProjects = [
    {
      id: '1',
      title: 'React E-commerce Platform Development',
      description: 'Build a modern e-commerce platform with React, Redux, and Node.js backend integration.',
      client: 'TechStart Inc.',
      budget: 4500,
      location: 'Remote',
      appliedDate: '2024-01-15',
      status: 'pending',
      proposalViews: 23,
      lastActivity: '2 hours ago',
      deadline: '2024-02-15',
      skills: ['React', 'Node.js', 'MongoDB', 'Redux'],
      proposalAmount: 4200,
      deliveryTime: '30 days'
    },
    {
      id: '2',
      title: 'Mobile App UI/UX Design',
      description: 'Design modern and intuitive user interface for fitness tracking mobile application.',
      client: 'FitLife Solutions',
      budget: 3200,
      location: 'New York, NY',
      appliedDate: '2024-01-12',
      status: 'interviewing',
      proposalViews: 45,
      lastActivity: '1 day ago',
      deadline: '2024-02-01',
      skills: ['Figma', 'UI/UX', 'Mobile Design', 'Prototyping'],
      proposalAmount: 3000,
      deliveryTime: '21 days'
    },
    {
      id: '3',
      title: 'Python Data Analysis Project',
      description: 'Analyze customer data and create comprehensive visualizations and insights.',
      client: 'DataCorp Analytics',
      budget: 2800,
      location: 'Remote',
      appliedDate: '2024-01-10',
      status: 'rejected',
      proposalViews: 12,
      lastActivity: '3 days ago',
      deadline: '2024-01-25',
      skills: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis'],
      proposalAmount: 2600,
      deliveryTime: '14 days'
    }
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applied Projects</h1>
          <p className="text-slate-600">Track your project applications and their status</p>
        </div>
        <div className="text-sm text-slate-600">
          {filteredProjects.length} of {appliedProjects.length} applications
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOptions.slice(1).map((status) => (
          <div key={status.value} className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-2 mb-1">
              {getStatusIcon(status.value)}
              <span className="text-sm font-medium text-slate-700">{status.label}</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{statusCounts[status.value]}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                {/* Main Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 hover:text-blue-600 cursor-pointer">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 text-sm">by {project.client}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span>{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Project Budget</p>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">${project.budget.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Your Proposal</p>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">${project.proposalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Applied Date</p>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{new Date(project.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Location</p>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{project.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-500">
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
                <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                    <FileText className="w-4 h-4" />
                    <span>View Proposal</span>
                  </button>
                  {project.status === 'interviewing' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
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
        <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No applications found</h3>
          <p className="text-slate-600 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? "No applications match your current filters."
              : "You haven't applied to any projects yet. Start browsing projects to find opportunities!"
            }
          </p>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppliedProjects;