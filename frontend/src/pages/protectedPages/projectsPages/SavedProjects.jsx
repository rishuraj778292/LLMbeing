import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Filter, Calendar, DollarSign, MapPin, Bookmark, Trash2, BookmarkX } from 'lucide-react';
import ProjectCard from '../../../components/projects/ProjectCard';

const SavedProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('saved-date');
  const navigate = useNavigate();

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

  // No saved projects currently
  const savedProjects = [];

  const handleBrowseProjects = () => {
    navigate('/projects');
  };

  const filteredProjects = savedProjects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.skillsRequired?.some(skill =>
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'saved-date':
        return new Date(b.savedAt) - new Date(a.savedAt);
      case 'posted-date':
        return new Date(b.postedAt) - new Date(a.postedAt);
      case 'budget-high':
        return (b.budget || 0) - (a.budget || 0);
      case 'budget-low':
        return (a.budget || 0) - (b.budget || 0);
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const handleRemoveFromSaved = (projectId) => {
    // Handle removing project from saved list
    console.log('Removing project from saved:', projectId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Saved Projects</h1>
              <p className="text-xs sm:text-sm text-gray-600">Projects you've saved for later review</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''} saved
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder="Search saved projects..."
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
                <option value="saved-date">Recently Saved</option>
                <option value="posted-date">Recently Posted</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          {savedProjects.length > 0 && (
            <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
              {sortedProjects.length} of {savedProjects.length} saved projects
            </div>
          )}
        </div>

        {/* Projects List */}
        {sortedProjects.length > 0 ? (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <div key={project._id} className="relative group">
                {/* Saved Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                  <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    Saved {new Date(project.savedAt).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => handleRemoveFromSaved(project._id)}
                    className="p-1 bg-white border border-red-200 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Project Card */}
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                        <h3 className="font-bold text-lg text-slate-800 hover:text-blue-600 cursor-pointer transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium whitespace-nowrap">
                          {formatBudget(project.budget)}
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-slate-500 mb-3">
                        <span className="hover:text-blue-500 transition-colors cursor-pointer">{project.clientName}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span>{formatLocation(project.location)}</span>
                        <span className="mx-2 text-slate-300">•</span>
                        <span>Posted {new Date(project.postedAt).toLocaleDateString()}</span>
                      </div>

                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.skillsRequired?.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                        {project.skillsRequired?.length > 5 && (
                          <span className="text-xs text-slate-500">+{project.skillsRequired.length - 5} more</span>
                        )}
                      </div>

                      {project.category && (
                        <div className="inline-flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {project.category}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap">
                        Apply Now
                      </button>
                      <button className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
                        View Details
                      </button>
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

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">No saved projects</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-6 sm:mb-8 max-w-md lg:max-w-lg mx-auto">
                {searchTerm
                  ? "No saved projects match your search criteria. Try different keywords or browse all projects to find opportunities to save."
                  : "Start saving projects you're interested in to keep track of them easily. Use the bookmark feature on project listings to save projects for later review."
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
                      className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Browse Projects
                    </button>
                    <button className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 text-gray-700 font-semibold rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                      Learn About Saving
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

export default SavedProjects;