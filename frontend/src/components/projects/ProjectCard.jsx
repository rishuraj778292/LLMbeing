
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  MapPin,
  User,
  Tag,
  DollarSign,
  Bookmark,
  Eye,
} from 'lucide-react';
import { toggleSaveProject } from '../../../Redux/Slice/savedProjectSlice';
import { getCategoryLabel } from '../../utils/aiCategories';

const ProjectCard = React.forwardRef(({ project, viewMode = 'grid' }, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { savedProjectIds, toggleLoading } = useSelector(state => state.savedProjects);
  const { appliedProjectIds } = useSelector(state => state.applications);

  // Check if this project is saved
  const isSaved = savedProjectIds.includes(project._id);
  const isToggleLoading = toggleLoading[project._id];

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

  // Format the budget with thousand separators
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

    // If budget is already a string with currency symbol (legacy format)
    if (typeof budget === 'string' && (budget.includes('$') || budget.includes('€'))) {
      return budget;
    }

    // Otherwise format the number (legacy format)
    const numericBudget = typeof budget === 'number' ? budget : parseFloat(budget);
    if (isNaN(numericBudget)) return budget;

    return `$${numericBudget.toLocaleString()}`;
  };

  // Calculate the relative time for posted date
  const getRelativeTime = (postedAt) => {
    if (!postedAt) return "Recently posted";

    // If postedAt is already a formatted string, return it
    if (typeof postedAt === 'string' && !postedAt.match(/^\d+$/)) {
      return postedAt;
    }

    try {
      const postedDate = new Date(postedAt);
      const now = new Date();
      const diffTime = Math.abs(now - postedDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return postedAt;
    }
  };


  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Only freelancers can save projects
    if (user.role !== 'freelancer') {
      return;
    }

    try {
      await dispatch(toggleSaveProject(project._id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle save project:', error);
    }
  };

  const handleSeeDetails = (e) => {
    e.stopPropagation();
    navigate(`/project/${project.slug || project._id}`);
  };

  const handleApply = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/project/${project.slug || project._id}/apply`);
  };

  // Check if user is the project owner
  const isOwner = user && project.createdBy === user._id;

  // Check if the user has already applied to this project
  const hasApplied = React.useMemo(() => {
    if (!user || user.role !== 'freelancer') return false;

    // Check both the Redux appliedProjectIds array and the project's hasApplied flag
    const applied = Boolean(
      // Check if the project has the hasApplied flag set directly
      project.hasApplied ||
      // Also check the global appliedProjectIds array as a fallback
      (appliedProjectIds && appliedProjectIds.includes(project._id))
    );

    // Log application status for debugging
    if (applied) {
      console.log(`Project ${project._id} (${project.title}) is marked as applied`, {
        projectHasApplied: project.hasApplied,
        inAppliedIds: appliedProjectIds && appliedProjectIds.includes(project._id)
      });
    }

    return applied;
  }, [project._id, project.title, project.hasApplied, user, appliedProjectIds]);

  // Show apply button only for freelancers and not project owners
  const showApplyButton = user && user.role === 'freelancer' && !isOwner && !hasApplied;


  if (viewMode === 'list') {
    return (
      <div
        id={project.id}
        ref={ref}
        className="border border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Left: Main Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
              <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-300">
                {project.title}
              </h3>
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium whitespace-nowrap">
                {formatBudget(project.budget)}
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-3">
              <User className="h-4 w-4 mr-1 text-gray-400" />
              <span className="hover:text-blue-500 transition-colors cursor-pointer">{project.clientName}</span>
              <span className="mx-2 text-gray-300">•</span>
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              <span>{formatLocation(project.location)}</span>
              <span className="mx-2 text-gray-300">•</span>
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{getRelativeTime(project.postedAt)}</span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {project.description || "No description provided"}
            </p>

            {/* Categories */}
            {project.projectCategory && project.projectCategory.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.projectCategory.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
                  >
                    <Tag className="h-3 w-3 mr-1 inline" />
                    {getCategoryLabel(category)}
                  </span>
                ))}
                {project.projectCategory.length > 2 && (
                  <span className="text-xs text-gray-500 py-1">+{project.projectCategory.length - 2} more</span>
                )}
              </div>
            )}

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {project.skillsRequired && project.skillsRequired.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {project.skillsRequired && project.skillsRequired.length > 5 && (
                <button className="text-xs text-gray-500 cursor-pointer" onClick={handleSeeDetails}>+{project.skillsRequired.length - 5}

                  more</button>
              )}
            </div>
          </div>

          {/* Right: Actions - Bookmark on top, buttons on bottom */}
          <div className="flex flex-col justify-between items-center lg:items-end h-full">
            {/* Bookmark on top */}
            <div>
              {user?.role === 'freelancer' && (
                <button
                  onClick={handleBookmark}
                  disabled={isToggleLoading}
                  className={`flex items-center gap-2 transition-colors p-2 rounded-lg ${isSaved
                    ? 'text-blue-500 bg-blue-50'
                    : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                    } ${isToggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isSaved ? 'Remove from saved projects' : 'Save project'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  {isToggleLoading && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                </button>
              )}
            </div>

            {/* Action buttons on bottom */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={handleSeeDetails}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Details
              </button>

              {showApplyButton && (
                <button
                  onClick={handleApply}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Apply Now
                </button>
              )}

              {hasApplied && (
                <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Applied
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={project.id}
      ref={ref}
      className="border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Header with title and budget */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start gap-2 mb-3">
          <h3
            onClick={handleSeeDetails}
            className="font-bold text-lg text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-300 line-clamp-2"
          >
            {project.title}
          </h3>
          {user?.role === 'freelancer' && (
            <button
              onClick={handleBookmark}
              disabled={isToggleLoading}
              className={`transition-colors p-1 ${isSaved
                ? 'text-blue-500'
                : 'text-gray-400 hover:text-blue-500'
                } ${isToggleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isSaved ? 'Remove from saved projects' : 'Save project'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-medium w-fit">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatBudget(project.budget)}
        </div>

        <div className="mt-3 flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-1 text-gray-400" />
          <span className="hover:text-blue-500 transition-colors cursor-pointer truncate">{project.clientName}</span>
          <span className="mx-2 text-gray-300">•</span>
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span className="truncate">{formatLocation(project.location)}</span>
        </div>
      </div>

      {/* Body with description */}
      <div className="px-5 py-4 flex-grow">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {project.description || "No description provided"}
        </p>



        {/* Categories section */}
        {project.projectCategory && project.projectCategory.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.projectCategory.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                <Tag className="h-3 w-3 mr-1 inline" />
                {getCategoryLabel(category)}
              </span>
            ))}
            {project.projectCategory.length > 2 && (
              <span className="text-xs text-gray-500 py-1">+{project.projectCategory.length - 2} more</span>
            )}
          </div>
        )}

        {/* Skills section */}
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2">
            {project.skillsRequired && project.skillsRequired.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {skill}
              </span>
            ))}
            {project.skillsRequired && project.skillsRequired.length > 4 && (
              <span className="text-xs text-gray-500 py-1">+{project.skillsRequired.length - 4} more</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer with posted time and action - Column layout */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto flex flex-col gap-2">
        {/* Posted time */}
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          <span>{getRelativeTime(project.postedAt)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleSeeDetails}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <Eye className="w-4 h-4" />
            Details
          </button>

          {showApplyButton && (
            <button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Apply Now
            </button>
          )}

          {hasApplied && (
            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-2 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Applied
            </span>
          )}
        </div>
      </div>
    </div>);
});

export default ProjectCard;