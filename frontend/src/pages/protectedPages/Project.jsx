
import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProjects } from '../../../Redux/Slice/projectSlice';

import Projectbar from '../../components/projects/Projectbar';
const Project = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { projects, page, totalPages, status, loadingMore } = useSelector((state) => state.projects);
  const observer = useRef();

  // Get search query from URL
  const searchQuery = searchParams.get('search') || '';

  const lastProjectRef = useCallback(
    (node) => {
      if (loadingMore || status === 'loading' || page >= totalPages) return;

      // Disconnect the previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer for the last project
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          // Dispatch fetchProjects with the next page and search filters
          const filters = {
            projectType: 'hourly',
            ...(searchQuery && { search: searchQuery })
          };
          dispatch(fetchProjects({ page: page + 1, limit: 10, filters }));
        }
      });

      // Start observing the last node (last project)
      if (node) observer.current.observe(node);
    },
    [dispatch, page, totalPages, loadingMore, status, searchQuery]
  );

  useEffect(() => {
    // Initial data fetch for projects with search filter
    const filters = {
      projectType: 'hourly',
      ...(searchQuery && { search: searchQuery })
    };
    dispatch(fetchProjects({ page: 1, limit: 10, filters }));
  }, [dispatch, searchQuery]);

  return (
    <div className='flex flex-col gap-6 min-h-screen bg-gray-50'>
      <Projectbar />

      {/* Search Results Header */}
      {searchQuery && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">Search Results for:</span>
              <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg">"{searchQuery}"</span>
            </div>
            <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1 rounded-full">
              {projects.length} projects found
            </span>
          </div>
        </div>
      )}

      <div className='flex flex-row gap-6'>
        {/* Main Projects List */}
        <div className='flex-1 flex flex-col gap-4'>
          {status === 'loading' && (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-4">Loading projects...</p>
            </div>
          )}

          {projects.length === 0 && status !== 'loading' && (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No Projects Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery
                  ? `No projects match your search for "${searchQuery}". Try different keywords or browse all projects.`
                  : "No projects are currently available. Check back later for new opportunities."
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => window.location.href = '/projects'}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Browse All Projects
                </button>
              )}
            </div>
          )}

          {projects.map((project, idx) => (
            <div
              ref={idx === projects.length - 1 ? lastProjectRef : null}
              key={project._id}
              className='bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group'
            >
              <div className="flex flex-col space-y-4">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {project.projectType || 'Hourly'}
                    </span>
                  </div>
                </div>

                {/* Project Description */}
                <p className="text-gray-700 leading-relaxed line-clamp-3">
                  {project.description}
                </p>

                {/* Project Details */}
                <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-100">
                  {project.budget && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">Budget:</span>
                      <span className="font-medium text-green-600">${project.budget.toLocaleString()}</span>
                    </div>
                  )}
                  {project.duration && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-900">{project.duration}</span>
                    </div>
                  )}
                  {project.skillsRequired && project.skillsRequired.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.skillsRequired.slice(0, 3).map((skill, index) => (
                          <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                        {project.skillsRequired.length > 3 && (
                          <span className="text-xs text-gray-500">+{project.skillsRequired.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Project Actions */}
                <div className="flex items-center justify-between pt-3">
                  <div className="text-sm text-gray-500">
                    Posted {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                      View Details
                    </button>
                    <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loadingMore && (
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
              <p className="text-gray-600 mt-3">Loading more projects...</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className='w-80 flex flex-col gap-4'>
          {/* Filter Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Project Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>All Types</option>
                  <option>Fixed Price</option>
                  <option>Hourly</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Budget Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Any Budget</option>
                  <option>Under $500</option>
                  <option>$500 - $1,000</option>
                  <option>$1,000 - $5,000</option>
                  <option>$5,000+</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Duration</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Any Duration</option>
                  <option>Less than 1 week</option>
                  <option>1-4 weeks</option>
                  <option>1-3 months</option>
                  <option>3+ months</option>
                </select>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              Apply Filters
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Projects</span>
                <span className="font-semibold text-gray-900">{projects.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Today</span>
                <span className="font-semibold text-green-600">12</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Avg. Budget</span>
                <span className="font-semibold text-blue-600">$2,500</span>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Use specific keywords in your search</p>
              <p>• Apply early for better chances</p>
              <p>• Customize your proposal for each project</p>
              <p>• Highlight relevant experience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
