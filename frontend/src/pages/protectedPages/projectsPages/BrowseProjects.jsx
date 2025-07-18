import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../../Redux/Slice/projectSlice';
import ProjectCard from '../../../components/projects/ProjectCard';
import ProjectFilterSidebar from '../../../components/projects/ProjectFilterSidebar';
import { Grid, List, Search, Filter, SortAsc } from 'lucide-react';

const BrowseProjects = () => {
  const dispatch = useDispatch();
  const { projects, page, totalPages, status, loadingMore } = useSelector((state) => state.projects);
  const observer = useRef();

  // postion for filtersidebar
   const [stopScroll,setStopScroll] = useState(false);
     useEffect(()=>{
            const handleScroll = ()=>{
              const scroll_y = window.scrollY;
              setStopScroll(scroll_y>300)
              };
  
              window.addEventListener('scroll',handleScroll)
              return ()=>{
                window.removeEventListener('scroll',handleScroll)
              }
     })
      let  className = `hidden lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
      useEffect(()=>{
          if(stopScroll){
              className = `fixed top-20 hidden  lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
          }
          else{
              className = `hidden lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`;
          }
      },[stopScroll])


  // Local state for UI controls
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const lastProjectRef = useCallback(
    (node) => {
      if (loadingMore || status === 'loading' || page >= totalPages) return;

      // Disconnect the previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer for the last project
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          // Dispatch fetchProjects with the next page
          dispatch(fetchProjects({ page: page + 1, limit: 10, filters: { projectType: 'hourly' } }));
        }
      });

      // Start observing the last node (last project)
      if (node) observer.current.observe(node);
    },
    [dispatch, page, totalPages, loadingMore, status]
  );

  useEffect(() => {
    // Initial data fetch for projects
    dispatch(fetchProjects({ page: 1, limit: 10, filters: { projectType: 'hourly' } }));
  }, [dispatch]);

  const filteredProjects = projects.filter(project =>
    project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
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
      <div className={}>
        <ProjectFilterSidebar />
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <ProjectFilterSidebar />
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === 'loading' && projects.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading projects...</p>
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
      </div>
    </div>
  );
};

export default BrowseProjects;
