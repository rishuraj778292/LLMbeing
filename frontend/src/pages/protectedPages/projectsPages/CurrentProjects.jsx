import { useState, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Trash2, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOwnProjects } from '../../../../Redux/Slice/projectSlice';

const CurrentProjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useSelector((state) => state.auth);
  const { ownProjects, status } = useSelector((state) => state.projects);

  useEffect(() => {
    if (user) {
      dispatch(fetchOwnProjects());
    }
  }, [dispatch, user]);

  const filteredProjects = (ownProjects || []).filter(project => {
    const matchesSearch = !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || project.projectStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusOptions = user?.role === 'client'
    ? [
      { value: 'all', label: 'All Projects' },
      { value: 'draft', label: 'Draft' },
      { value: 'active', label: 'Active' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'paused', label: 'Paused' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
    : [
      { value: 'all', label: 'All Applied Projects' },
      { value: 'pending', label: 'Pending' },
      { value: 'accepted', label: 'Accepted' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'completed', label: 'Completed' }
    ];

  const formatBudget = (budget) => {
    if (!budget) return "Not specified";
    if (typeof budget === 'object') {
      if (budget.hourlyRate) {
        const { min, max } = budget.hourlyRate;
        if (min && max) return `$${min}-$${max}/hr`;
        return `$${min || max}/hr`;
      }
      if (budget.min && budget.max) return `$${budget.min}-$${budget.max}`;
    }
    return `$${budget}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-700',
      active: 'bg-green-100 text-green-700',
      in_progress: 'bg-blue-100 text-blue-700',
      completed: 'bg-emerald-100 text-emerald-700',
      paused: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleBrowseProjects = () => {
    navigate('/projects');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                {user?.role === 'freelancer' ? 'Active Projects' : 'Your Active Projects'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {user?.role === 'freelancer'
                  ? 'Manage your ongoing work and track project progress.'
                  : 'Monitor your posted projects and collaborate with freelancers.'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                {filteredProjects.length} of {ownProjects?.length || 0} projects
              </div>
              {user?.role === 'client' && (
                <button
                  onClick={() => navigate('/post-project')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  New Project
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(ownProjects?.length || 0) > 0 && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              {filteredProjects.length} of {ownProjects?.length || 0} projects
            </div>
          )}
        </div>

        {/* Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.projectStatus)}`}>
                      {project.projectStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatBudget(project.budget)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{project.stats?.proposalCount || 0} proposals</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Eye className="h-4 w-4" />
                      <span>{project.stats?.viewCount || 0} views</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {project.skillsRequired?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {project.skillsRequired?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                          +{project.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/project/${project.slug || project._id}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
                      {user?.role === 'client' && (
                        <>
                          <button
                            onClick={() => navigate(`/project/${project.slug || project._id}/edit`)}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-700 text-sm font-medium"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {/* Handle delete */ }}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center py-12 sm:py-16 px-6 sm:px-8">

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                {user?.role === 'freelancer' ? 'No active projects' : 'No active projects'}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 sm:mb-8 max-w-md lg:max-w-lg mx-auto">
                {searchTerm || statusFilter !== 'all'
                  ? "No projects match your current filters. Try adjusting your search criteria."
                  : user?.role === 'freelancer'
                    ? "You don't have any active projects yet. Start applying to projects to begin working and building your portfolio!"
                    : "You don't have any active projects yet. Post a project to get started and connect with talented freelancers!"
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {(searchTerm || statusFilter !== 'all') ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-200 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Clear filters
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleBrowseProjects}
                      className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer">
                      {user?.role === 'freelancer' ? 'Browse Projects' : 'Post a Project'}
                    </button>
                    {user?.role === 'freelancer' && (
                      <button className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                        View Application Tips
                      </button>
                    )}
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

export default CurrentProjects;