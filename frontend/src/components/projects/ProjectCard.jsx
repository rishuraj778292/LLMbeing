
// import React from 'react'

// const ProjectCard = React.forwardRef(({ project },ref) => {
//   return (
//     <div id={project.id} ref={ref} className='border border-gray-300 bg-gray-50 rounded-2xl p-5 '>
//       <div>
//         <p className='font-bold'>
//           {project.title}
//         </p>

//       </div>

//       <div>
//         <p>
//           budget : <span className='text-gray-400'>{project.budget}</span>
//         </p>
//       </div>


//       <div>
//         <p>
//           Proposal : <span className='text-gray-400' >{project.proposal}</span>
//         </p>
//       </div>

//       <div>
//         <p className='text-gray-400'>
//           {project.clientName}
//         </p>
//       </div>

//       <div>
//         <p>Location : <span className='text-gray-400'>{project.location}</span></p>
//       </div>

//       <div>
//         <p className='text-gray-400'>{project.description}</p>
//       </div>

//       <div className='flex gap-3'>
//         Skills required :         {project.skillsRequired.map(skill =>
//         (
//           <p className='text-gray-400'>{skill}</p>
//         )
//         )}
//       </div>

//       <div>
//         <p>
//           {project.postedAt}
//         </p>
//       </div>

//     </div>
//   )
// })

// export default ProjectCard

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Clock,
  MapPin,
  Briefcase,
  User,
  Tag,
  DollarSign,
  Heart,
  BookmarkPlus,
  ThumbsDown,
  Eye,
  ExternalLink
} from 'lucide-react';
import {
  toggleLike,
  toggleDislike,
  toggleBookmark,
  updateProjectInteraction
} from '../../../Redux/Slice/projectSlice';

const ProjectCard = React.forwardRef(({ project, viewMode = 'grid' }, ref) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

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

  // Handle interaction functions
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    dispatch(updateProjectInteraction({
      projectId: project._id,
      type: 'like',
      isActive: !project.isLiked
    }));

    try {
      await dispatch(toggleLike(project._id)).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateProjectInteraction({
        projectId: project._id,
        type: 'like',
        isActive: project.isLiked
      }));
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    dispatch(updateProjectInteraction({
      projectId: project._id,
      type: 'dislike',
      isActive: !project.isDisliked
    }));

    try {
      await dispatch(toggleDislike(project._id)).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateProjectInteraction({
        projectId: project._id,
        type: 'dislike',
        isActive: project.isDisliked
      }));
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }

    // Optimistic update
    dispatch(updateProjectInteraction({
      projectId: project._id,
      type: 'bookmark',
      isActive: !project.isBookmarked
    }));

    try {
      await dispatch(toggleBookmark(project._id)).unwrap();
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateProjectInteraction({
        projectId: project._id,
        type: 'bookmark',
        isActive: project.isBookmarked
      }));
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

  // Show apply button only for freelancers and not project owners
  const showApplyButton = user && user.role === 'freelancer' && !isOwner && !project.hasApplied;

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
                <DollarSign className="h-4 w-4 mr-1" />
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
                <span className="text-xs text-gray-500">+{project.skillsRequired.length - 5} more</span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-row lg:flex-col gap-2 lg:items-end">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors p-2 rounded-lg ${project.isLiked
                  ? 'text-red-500 bg-red-50'
                  : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                }`}
            >
              <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`} />
              {project.likesCount > 0 && <span className="text-xs">{project.likesCount}</span>}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 transition-colors p-2 rounded-lg ${project.isDisliked
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
                }`}
            >
              <ThumbsDown className={`w-4 h-4 ${project.isDisliked ? 'fill-current' : ''}`} />
              {project.dislikesCount > 0 && <span className="text-xs">{project.dislikesCount}</span>}
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 transition-colors p-2 rounded-lg ${project.isBookmarked
                  ? 'text-blue-500 bg-blue-50'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
                }`}
            >
              <BookmarkPlus className={`w-4 h-4 ${project.isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <div className="flex gap-2">
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

              {project.hasApplied && (
                <span className="bg-green-100 text-green-700 text-sm font-medium px-4 py-2 rounded-lg whitespace-nowrap">
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
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`transition-colors p-1 ${project.isLiked
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-red-500'
                }`}
            >
              <Heart className={`w-4 h-4 ${project.isLiked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleDislike}
              className={`transition-colors p-1 ${project.isDisliked
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-orange-500'
                }`}
            >
              <ThumbsDown className={`w-4 h-4 ${project.isDisliked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleBookmark}
              className={`transition-colors p-1 ${project.isBookmarked
                  ? 'text-blue-500'
                  : 'text-gray-400 hover:text-blue-500'
                }`}
            >
              <BookmarkPlus className={`w-4 h-4 ${project.isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
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

        {project.proposal && (
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-1">Proposal Requirements:</div>
            <p className="text-sm text-gray-600 line-clamp-2">{project.proposal}</p>
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

      {/* Footer with posted time and action */}
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 mt-auto flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1 text-gray-400" />
          <span>{getRelativeTime(project.postedAt)}</span>
        </div>

        <div className="flex gap-2">
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

          {project.hasApplied && (
            <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-2 rounded-lg">
              Applied
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;