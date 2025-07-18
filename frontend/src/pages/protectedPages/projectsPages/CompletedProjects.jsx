import { useState } from 'react';
import { Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CompletedProjects = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('completion-date');
  const { user } = useSelector((state) => state.auth);

  // No completed projects currently
  const completedProjects = [];

  const filteredProjects = completedProjects.filter(project => {
    const matchesSearch = !searchTerm ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const sortOptions = [
    { value: 'completion-date', label: 'Recently Completed' },
    { value: 'rating-high', label: 'Highest Rated' },
    { value: 'payment-high', label: 'Highest Paid' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

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
                {user?.role === 'freelancer' ? 'Completed Projects' : 'Completed Projects'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                {user?.role === 'freelancer'
                  ? 'Review your successfully completed work and achievements.'
                  : 'View your completed projects and freelancer collaborations.'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                {filteredProjects.length} of {completedProjects.length} completed projects
              </div>
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
                placeholder="Search completed projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {completedProjects.length > 0 && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              {filteredProjects.length} of {completedProjects.length} completed projects
            </div>
          )}
        </div>

        {/* Projects List */}
        {filteredProjects.length > 0 ? (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                {/* Project content would go here */}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center py-12 sm:py-16 px-6 sm:px-8">

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">
                {user?.role === 'freelancer' ? 'No completed projects' : 'No completed projects'}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 sm:mb-8 max-w-md lg:max-w-lg mx-auto">
                {searchTerm
                  ? "No completed projects match your search criteria. Try different keywords or browse all completed work."
                  : user?.role === 'freelancer'
                    ? "You haven't completed any projects yet. Start working on projects to build your portfolio and showcase your expertise to potential clients!"
                    : "You don't have any completed projects yet. Once projects are finished successfully, they'll appear here for your review and records."
                }
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-200 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Clear search
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
                        View Portfolio Tips
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

export default CompletedProjects;