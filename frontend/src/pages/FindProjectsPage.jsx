import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Grid3X3,
    List,
    SortAsc,
    SortDesc,
    MapPin,
    DollarSign,
    Clock,
    Briefcase,
    ArrowUp
} from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilterSidebar from '../components/projects/ProjectFilterSidebar';
import {
    fetchProjects,
    resetProjects,
    updateFilters
} from '../../Redux/Slice/projectSlice';
import { getUserApplications } from '../../Redux/Slice/applicationSlice';

const FindProjectsPage = () => {
    const dispatch = useDispatch();
    const {
        projects,
        status,
        error,
        page,
        totalPages,
        total,
        loadingMore,
        filters
    } = useSelector(state => state.projects);

    const { appliedProjectIds } = useSelector(state => state.applications);
    const { user } = useSelector(state => state.auth);

    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('list'); // Default to list view
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');
    const [showScrollTop, setShowScrollTop] = useState(false);
    const observerRef = useRef();
    const lastProjectElementRef = useRef();

    // Initialize filters from URL params
    useEffect(() => {
        const urlFilters = {
            search: searchParams.get('search') || '',
            categories: searchParams.get('categories')?.split(',').filter(Boolean) || [],
            skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
            experienceLevel: searchParams.get('experienceLevel') || '',
            projectType: searchParams.get('projectType') || '',
            budgetMin: searchParams.get('budgetMin') || '',
            budgetMax: searchParams.get('budgetMax') || '',
            location: searchParams.get('location') || '',
            sortBy: searchParams.get('sortBy') || 'newest'
        };

        setSearchInput(urlFilters.search);
        dispatch(updateFilters(urlFilters));
    }, [searchParams, dispatch]);

    // Handle scroll for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch projects when filters change
    useEffect(() => {
        dispatch(resetProjects());
        dispatch(fetchProjects({ ...filters, page: 1 }));
    }, [dispatch, filters]);

    // Fetch user applications for freelancers to filter out applied projects
    useEffect(() => {
        if (user?.role === 'freelancer') {
            dispatch(getUserApplications({ limit: 1000 })); // Get all applications to track applied projects
        }
    }, [dispatch, user]);

    // Update URL when filters change
    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.length > 0) {
                if (Array.isArray(value)) {
                    params.set(key, value.join(','));
                } else {
                    params.set(key, value);
                }
            }
        });

        setSearchParams(params);
    }, [filters, setSearchParams]);

    // Infinite scroll setup
    const lastProjectElementCallback = useCallback(node => {
        if (loadingMore) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && page < totalPages) {
                dispatch(fetchProjects({ ...filters, page: page + 1 }));
            }
        });

        if (node) observerRef.current.observe(node);
    }, [loadingMore, page, totalPages, filters, dispatch]);

    // Combine refs for the last project element
    const setLastProjectElementRef = useCallback((node) => {
        lastProjectElementRef.current = node;
        lastProjectElementCallback(node);
    }, [lastProjectElementCallback]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        dispatch(updateFilters({ ...filters, search: searchInput }));
    };

    const handleFilterChange = (newFilters) => {
        dispatch(updateFilters({ ...filters, ...newFilters }));
    };

    const clearAllFilters = () => {
        const clearedFilters = {
            search: '',
            categories: [],
            skills: [],
            experienceLevel: '',
            projectType: '',
            budgetMin: '',
            budgetMax: '',
            location: '',
            sortBy: 'newest'
        };
        setSearchInput('');
        dispatch(updateFilters(clearedFilters));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First', icon: SortDesc },
        { value: 'oldest', label: 'Oldest First', icon: SortAsc },
        { value: 'budget-high', label: 'Highest Budget', icon: DollarSign },
        { value: 'budget-low', label: 'Lowest Budget', icon: DollarSign },
        { value: 'most-liked', label: 'Most Liked', icon: SortDesc }
    ];

    const activeFiltersCount = Object.values(filters).reduce((count, value) => {
        if (Array.isArray(value)) {
            return count + value.length;
        }
        return count + (value ? 1 : 0);
    }, 0) - 1; // Subtract 1 for sortBy which is always present

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header - Consistent with other pages */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Find Projects</h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Discover freelance opportunities that match your skills
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="lg:max-w-md lg:w-full">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        placeholder="Search projects..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Filters */}
                    <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <ProjectFilterSidebar
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearAll={clearAllFilters}
                                activeFiltersCount={activeFiltersCount}
                            />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Controls Bar */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Toggle */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="lg:hidden flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                                    >
                                        <Filter className="h-4 w-4" />
                                        Filters
                                        {activeFiltersCount > 0 && (
                                            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Results Count */}
                                    <div className="text-sm text-gray-600">
                                        {status === 'loading' && page === 1 ? (
                                            'Loading...'
                                        ) : (
                                            `${total.toLocaleString()} projects found`
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Sort Dropdown */}
                                    <div className="relative">
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* View Mode Toggle */}
                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded ${viewMode === 'grid'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <Grid3X3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded ${viewMode === 'list'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {activeFiltersCount > 0 && (
                            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {filters.search && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            Search: "{filters.search}"
                                        </span>
                                    )}
                                    {filters.categories.map(category => (
                                        <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            {category}
                                        </span>
                                    ))}
                                    {filters.skills.map(skill => (
                                        <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            {skill}
                                        </span>
                                    ))}
                                    {filters.experienceLevel && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            {filters.experienceLevel} Level
                                        </span>
                                    )}
                                    {filters.projectType && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            {filters.projectType}
                                        </span>
                                    )}
                                    {(filters.budgetMin || filters.budgetMax) && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            Budget: ${filters.budgetMin || '0'} - ${filters.budgetMax || '∞'}
                                        </span>
                                    )}
                                    {filters.location && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {filters.location}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error State */}
                        {status === 'failed' && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Projects</h3>
                                    <p className="text-red-700 mb-4">{error}</p>
                                    <button
                                        onClick={() => dispatch(fetchProjects({ ...filters, page: 1 }))}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {status === 'succeeded' && projects.length === 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12">
                                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Found</h3>
                                    <p className="text-gray-600 mb-4">
                                        We couldn't find any projects matching your criteria.
                                    </p>
                                    <button
                                        onClick={clearAllFilters}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Projects Grid/List */}
                        {projects.length > 0 && (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                        : 'space-y-4'
                                }>
                                    {projects
                                        .filter(project => {
                                            // For freelancers, filter out applied projects
                                            if (user?.role === 'freelancer' && appliedProjectIds.includes(project._id)) {
                                                return false;
                                            }
                                            return true;
                                        })
                                        .map((project, index) => {
                                            const isLast = index === projects.length - 1;
                                            return (
                                                <ProjectCard
                                                    key={project._id}
                                                    project={project}
                                                    viewMode={viewMode}
                                                    ref={isLast ? setLastProjectElementRef : null}
                                                />
                                            );
                                        })}
                                </div>

                                {/* Loading More Indicator */}
                                {loadingMore && (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-2 text-gray-600">Loading more projects...</span>
                                    </div>
                                )}

                                {/* End of Results */}
                                {page >= totalPages && projects.length > 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-600">
                                            You've viewed all {total} projects. Try adjusting your filters to see more results.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Initial Loading State */}
                        {status === 'loading' && page === 1 && (
                            <div className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                    : 'space-y-4'
                            }>
                                {[...Array(viewMode === 'list' ? 6 : 9)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 rounded"></div>
                                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default FindProjectsPage;
