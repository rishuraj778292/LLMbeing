
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
import { Clock, MapPin, Briefcase, User, Tag, DollarSign, Heart, BookmarkPlus } from 'lucide-react';

const ProjectCard = React.forwardRef(({ project, viewMode = 'grid' }, ref) => {
  // Format the budget with thousand separators
  const formatBudget = (budget) => {
    if (!budget) return "Not specified";

    // If budget is already a string with currency symbol
    if (typeof budget === 'string' && (budget.includes('$') || budget.includes('€'))) {
      return budget;
    }

    // Otherwise format the number
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
    } catch (e) {
      return postedAt;
    }
  };

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
              <span>{project.location || "Remote"}</span>
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
            <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
              <Heart className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50">
              <BookmarkPlus className="w-4 h-4" />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors whitespace-nowrap">
              Apply Now
            </button>
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
          <h3 className="font-bold text-lg text-gray-800 hover:text-blue-600 cursor-pointer transition-colors duration-300 line-clamp-2">
            {project.title}
          </h3>
          <div className="flex gap-2">
            <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
              <Heart className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-blue-500 transition-colors p-1">
              <BookmarkPlus className="w-4 h-4" />
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
          <span className="truncate">{project.location || "Remote"}</span>
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

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          Apply Now
        </button>
      </div>
    </div>
  );
});

export default ProjectCard;