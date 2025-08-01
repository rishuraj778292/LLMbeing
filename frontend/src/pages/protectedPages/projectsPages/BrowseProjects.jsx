import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../../Redux/Slice/projectSlice';
import { getUserApplications } from '../../../../Redux/Slice/applicationSlice';
import ProjectCard from '../../../components/projects/ProjectCard';
import ProjectFilterSidebar from '../../../components/projects/ProjectFilterSidebar';
import { Grid, List, Search, Filter, SortAsc } from 'lucide-react';

const BrowseProjects = () => {
  const dispatch = useDispatch();
  const { projects, page, totalPages, status, loadingMore, total } = useSelector((state) => state.projects);
  const { user } = useSelector(state => state.auth);
  const { appliedProjectIds } = useSelector(state => state.applications);
  const observer = useRef();

  // postion for filtersidebar
  const [stopScroll, setStopScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const scroll_y = window.scrollY;
      setStopScroll(scroll_y > 300)
    };

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
  let className = `hidden lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
  useEffect(() => {
    if (stopScroll) {
      className = `fixed top-20 hidden  lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
    }
    else {
      className = `hidden lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
    }
  }, [stopScroll])


  // Local state for UI controls and filters
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    skills: [],
    experience: [],
    type: [],
    budget: { min: '', max: '' },
    location: []
  });

  const lastProjectRef = useCallback(
    (node) => {
      // If no node or if we're already loading or if we've reached the end, do nothing
      if (!node || loadingMore || status === 'loading' || page >= totalPages) return;

      // Disconnect the previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer for the last project
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          // Log loading attempt for debugging
          console.log(`Loading more projects - page ${page + 1} of ${totalPages}`);

          // Dispatch fetchProjects with the next page
          dispatch(fetchProjects({
            page: page + 1,
            limit: 10, // Reduced to match backend limit
            getAll: false, // For pagination we don't use getAll
            filters: {
              ...activeFilters,
              search: searchTerm || undefined
            }
          }));
        }
      }, {
        // Increase the root margin to load more projects earlier
        rootMargin: '200px',
        threshold: 0.1
      });

      // Start observing the last node (last project)
      observer.current.observe(node);
      console.log('Observer attached to node:', node);
    },
    [dispatch, page, totalPages, loadingMore, status, searchTerm, activeFilters]
  );

  useEffect(() => {
    // Initial data fetch for projects
    console.log('Initial projects fetch...');

    const fetchInitialData = async () => {
      try {
        // Fetch projects with pagination to match backend limit
        const result = await dispatch(fetchProjects({
          page: 1,
          limit: 10, // Reduced to match backend limit
          getAll: false, // Don't use getAll to respect backend pagination
          filters: {
            search: searchTerm || undefined,
            ...activeFilters
          }
        })).unwrap();

        console.log('Initial fetch result:', result);

        // Always fetch user applications if user is a freelancer
        if (user && user.role === 'freelancer') {
          console.log('Fetching user applications...');
          try {
            await dispatch(getUserApplications()).unwrap();
          } catch (error) {
            console.error('Error fetching applications:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchInitialData();
  }, [dispatch, user, searchTerm, activeFilters]);

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Component mounted logic
    return () => {
      // Component unmount cleanup
      isMounted.current = false;
    };
  }, []);

  // Add a specific effect to refresh projects when appliedProjectIds changes
  useEffect(() => {
    // Skip initial render or if no user
    if (!user || !appliedProjectIds) return;

    console.log('Applied projects changed, refreshing project list...');

    // Refresh projects with current filters when application status changes
    dispatch(fetchProjects({
      page: 1,
      limit: 10, // Reduced to match backend limit
      getAll: false, // Respect backend pagination
      filters: {
        search: searchTerm || undefined,
        ...activeFilters
      }
    }));
  }, [dispatch, appliedProjectIds, user, searchTerm, activeFilters]);

  // Debug effect to log pagination state changes
  useEffect(() => {
    console.log(`Pagination state updated: page ${page} of ${totalPages}, total projects: ${projects.length}`);
  }, [page, totalPages, projects.length]);

  // Function to refresh applications and then force-reload projects
  const refreshApplicationsAndProjects = useCallback(async () => {
    if (user && user.role === 'freelancer') {
      console.log('Force refreshing applications and projects...');

      try {
        // First fetch applications to update the appliedProjectIds
        await dispatch(getUserApplications()).unwrap();

        // Then fetch projects with pagination
        await dispatch(fetchProjects({
          page: 1,
          limit: 10, // Reduced to match backend limit
          getAll: false, // Respect backend pagination
          filters: {
            search: searchTerm || undefined,
            ...activeFilters
          }
        })).unwrap(); console.log('Applications and projects refreshed successfully');
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    }
  }, [dispatch, user, searchTerm, activeFilters]);

  // Function to force-fetch all projects
  const fetchAllProjects = useCallback(() => {
    console.log('Force-fetching projects page by page...');

    // Start with first page
    dispatch(fetchProjects({
      page: 1,
      limit: 10, // Reduced to match backend limit
      getAll: false, // Can't use getAll with hardcoded backend limit
      filters: {
        search: searchTerm || undefined,
        ...activeFilters
      }
    }));
  }, [dispatch, searchTerm, activeFilters]);  // Function to manually load more projects
  const loadMoreProjects = useCallback(() => {
    if (loadingMore || status === 'loading' || page >= totalPages) return;

    console.log(`Manually loading more projects - page ${page + 1} of ${totalPages}`);
    dispatch(fetchProjects({
      page: page + 1,
      limit: 10, // Reduced to match backend limit
      getAll: false,
      filters: {
        ...activeFilters,
        search: searchTerm || undefined
      }
    }));
  }, [dispatch, page, totalPages, loadingMore, status, activeFilters, searchTerm]);

  // Effect to load all pages if there aren't enough projects
  useEffect(() => {
    // If we have too few projects but there are more pages available,
    // automatically load the next page
    if (projects.length < 30 && page < totalPages && status !== 'loading' && !loadingMore) {
      console.log(`Auto-loading more projects - only ${projects.length} loaded but more pages available`);
      loadMoreProjects();
    }

    // If we have no projects at all but there should be some, try a force fetch
    if (projects.length === 0 && total > 0 && status !== 'loading') {
      console.log(`No projects loaded but ${total} exist - force fetching all`);
      fetchAllProjects();
    }

    // Log diagnostic information about project loading
    console.log(`Projects loaded: ${projects.length} of ${total} (Page ${page}/${totalPages})`);

    // If after applying there's a large decrease in projects, force a full refresh
    if (projects.length < 20 && total > 50 && appliedProjectIds && appliedProjectIds.length > 0) {
      console.log(`Few projects loaded (${projects.length}) after applying - force refreshing`);
      refreshApplicationsAndProjects();
    }
  }, [
    projects.length, page, totalPages, total,
    status, loadingMore, loadMoreProjects,
    fetchAllProjects, refreshApplicationsAndProjects,
    appliedProjectIds
  ]);

  // Let the backend handle filtering through searchTerm
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'budget-high':
        return (b.budget || 0) - (a.budget || 0);
      case 'budget-low':
        return (a.budget || 0) - (b.budget || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="flex gap-6">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block transition-all duration-300 w-72">
        <ProjectFilterSidebar
          filters={activeFilters}
          onFilterChange={(newFilters) => {
            setActiveFilters(newFilters);
            // Refresh projects with the new filters
            dispatch(fetchProjects({
              page: 1,
              limit: 10, // Reduced to match backend limit
              getAll: false, // Respect backend pagination
              filters: {
                ...newFilters,
                search: searchTerm || undefined
              }
            }));
          }}
          onClearAll={() => {
            setActiveFilters({
              categories: [],
              skills: [],
              experience: [],
              type: [],
              budget: { min: '', max: '' },
              location: []
            });
            // Refresh with no filters
            dispatch(fetchProjects({
              page: 1,
              limit: 10, // Reduced to match backend limit
              getAll: false, // Respect backend pagination
              filters: {
                search: searchTerm || undefined
              }
            }));
          }}
          activeFiltersCount={
            activeFilters.categories.length +
            activeFilters.skills.length +
            activeFilters.experience.length +
            activeFilters.type.length +
            (activeFilters.budget.min || activeFilters.budget.max ? 1 : 0) +
            activeFilters.location.length
          }
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Results Count */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    // Refresh projects when search term changes - handled by useEffect dependency
                  }}
                  className="pl-9 pr-4 py-2 w-full border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="budget-high">Budget: High to Low</option>
                <option value="budget-low">Budget: Low to High</option>
              </select>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 text-sm ${viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 text-sm ${viewMode === 'list'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
              <ProjectFilterSidebar
                filters={activeFilters}
                onFilterChange={(newFilters) => {
                  setActiveFilters(newFilters);
                  // Refresh projects with the new filters
                  dispatch(fetchProjects({
                    page: 1,
                    limit: 10, // Reduced to match backend limit
                    getAll: false, // Respect backend pagination
                    filters: {
                      ...newFilters,
                      search: searchTerm || undefined
                    }
                  }));
                }}
                onClearAll={() => {
                  setActiveFilters({
                    categories: [],
                    skills: [],
                    experience: [],
                    type: [],
                    budget: { min: '', max: '' },
                    location: []
                  });
                  // Refresh with no filters
                  dispatch(fetchProjects({
                    page: 1,
                    limit: 10, // Reduced to match backend limit
                    getAll: false, // Respect backend pagination
                    filters: {
                      search: searchTerm || undefined
                    }
                  }));
                }}
                activeFiltersCount={
                  activeFilters.categories.length +
                  activeFilters.skills.length +
                  activeFilters.experience.length +
                  activeFilters.type.length +
                  (activeFilters.budget.min || activeFilters.budget.max ? 1 : 0) +
                  activeFilters.location.length
                }
              />
            </div>
          </div>
        )}

        {/* Loading State - Initial Load */}
        {status === 'loading' && projects.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading projects...</p>
            </div>
          </div>
        )}

        {/* Loading State - Refreshing with existing data */}
        {status === 'loading' && projects.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm font-medium">Updating projects...</p>
            </div>
          </div>
        )}

        {/* Projects Grid/List */}
        {sortedProjects.length > 0 && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {sortedProjects.map((project, idx) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewMode={viewMode}
                ref={idx === sortedProjects.length - 1 ? lastProjectRef : null}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {sortedProjects.length === 0 && status !== 'loading' && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-4">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSortBy('newest');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Load More Indicator */}
        {loadingMore && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-slate-600">Loading more projects...</p>
            </div>
          </div>
        )}

        {/* End of Results */}
        {page >= totalPages && projects.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-600">You've reached the end of the results.</p>
          </div>
        )}

        {/* Load More Button - Show when close to end but not at end */}
        {page < totalPages && projects.length > 0 && !loadingMore && (
          <div className="text-center py-8">
            <button
              onClick={loadMoreProjects}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Load More Projects
            </button>

            {/* Add a force refresh button if we have less than expected projects */}
            {projects.length < 50 && (
              <button
                onClick={fetchAllProjects}
                className="ml-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Force Load All Projects
              </button>
            )}
          </div>
        )}

        {/* Add debug information */}
        <div className="text-center text-xs text-gray-500 py-2">
          <p>Showing {projects.length} of {total} projects (Page {page} of {totalPages})</p>
          {appliedProjectIds && appliedProjectIds.length > 0 && (
            <p>You have applied to {appliedProjectIds.length} projects</p>
          )}

          {/* Button to sync application status with projects */}
          {user && user.role === 'freelancer' && (
            <button
              onClick={refreshApplicationsAndProjects}
              className="mt-2 px-4 py-1 bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 rounded transition-colors"
            >
              Sync Application Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProjects;
