import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../../Redux/Slice/projectSlice';
import ProjectCard from '../../../components/projects/ProjectCard';
import ProjectFilterSidebar from '../../../components/projects/ProjectFilterSidebar';
import { Search, Filter, SortAsc, Grid, List, Briefcase, Clock, TrendingUp } from 'lucide-react';

const FindProjectsPage = () => {
    const dispatch = useDispatch();
    const { projects, page, totalPages, status, loadingMore } = useSelector((state) => state.projects);
    const observer = useRef();

    // Local state for UI controls - default to list view
    const [viewMode, setViewMode] = useState('list');
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');

    const lastProjectRef = useCallback(
        (node) => {
            if (loadingMore || status === 'loading' || page >= totalPages) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && page < totalPages) {
                    dispatch(fetchProjects({ page: page + 1, limit: 10, filters: { projectType: 'hourly' } }));
                }
            });

            if (node) observer.current.observe(node);
        },
        [dispatch, page, totalPages, loadingMore, status]
    );

    useEffect(() => {
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
        <div className="min-h-screen bg-slate-50">
            {/* Enhanced Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Projects</h1>
                            <p className="text-lg text-slate-600 mb-4">
                                Discover opportunities that match your skills and grow your career
                            </p>

                            {/* Quick Stats */}
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">{projects.length}</span>
                                    <span>Active Projects</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="font-medium">156</span>
                                    <span>Posted Today</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-slate-600">
                                    <Clock className="w-4 h-4 text-orange-600" />
                                    <span className="font-medium">Avg 2-3 days</span>
                                    <span>Response Time</span>
                                </div>
                            </div>
                        </div>

                        {/* Primary Search Bar */}
                        <div className="w-full lg:w-96">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search projects by title, skills, or keywords..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="flex gap-6">
                    {/* Sidebar Filters - Desktop */}
                    <div className={`hidden lg:block transition-all duration-300 ${showFilters ? 'w-80' : 'w-72'}`}>
                        <div className="sticky top-6">
                            <ProjectFilterSidebar />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Enhanced Controls Bar */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                {/* Results Info */}
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <span className="text-sm font-medium text-slate-900">
                                            {sortedProjects.length} project{sortedProjects.length !== 1 ? 's' : ''}
                                        </span>
                                        <span className="text-sm text-slate-500 ml-1">
                                            • Sorted by {sortBy.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center space-x-3">
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="pl-9 pr-8 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="oldest">Oldest First</option>
                                            <option value="budget-high">Budget: High to Low</option>
                                            <option value="budget-low">Budget: Low to High</option>
                                        </select>
                                    </div>

                                    {/* Mobile Filter Toggle */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filters</span>
                                    </button>

                                    {/* View Mode Toggle */}
                                    <div className="hidden sm:flex border border-slate-300 rounded-lg overflow-hidden bg-white">
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 text-sm transition-colors ${viewMode === 'list'
                                                ? 'bg-blue-500 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                            title="List View"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 text-sm transition-colors ${viewMode === 'grid'
                                                ? 'bg-blue-500 text-white'
                                                : 'text-slate-600 hover:bg-slate-50'
                                                }`}
                                            title="Grid View"
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters */}
                        {showFilters && (
                            <div className="lg:hidden mb-6">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <ProjectFilterSidebar />
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {status === 'loading' && projects.length === 0 && (
                            <div className="flex items-center justify-center py-16">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-slate-600 font-medium">Discovering amazing projects...</p>
                                    <p className="text-sm text-slate-500 mt-1">This won't take long</p>
                                </div>
                            </div>
                        )}

                        {/* Projects Display */}
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

                        {/* Enhanced No Results State */}
                        {sortedProjects.length === 0 && status !== 'loading' && (
                            <div className="text-center py-16">
                                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    We couldn't find any projects matching your criteria. Try adjusting your search terms or filters.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setSortBy('newest');
                                        }}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                    <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                                        Browse all categories
                                    </button>
                                </div>
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
                                <div className="bg-slate-50 rounded-lg p-6">
                                    <p className="text-slate-600 font-medium">🎉 You've seen all available projects!</p>
                                    <p className="text-sm text-slate-500 mt-1">Check back later for new opportunities</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindProjectsPage;
