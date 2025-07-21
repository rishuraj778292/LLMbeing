import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Search,
    Bookmark,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import ProjectCard from '../../../components/projects/ProjectCard';
import {
    fetchSavedProjects,
    removeAllSavedProjects,
    resetSavedProjects
} from '../../../../Redux/Slice/savedProjectSlice';

const SavedProjects = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        savedProjects,
        status,
        error,
        total,
        page,
        hasMore,
        loadingMore
    } = useSelector(state => state.savedProjects);

    const { user } = useSelector(state => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('saved-date');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch saved projects on component mount
    useEffect(() => {
        if (user) {
            dispatch(resetSavedProjects());
            dispatch(fetchSavedProjects({ page: 1, limit: 20 }));
        }
    }, [dispatch, user]);

    // Load more projects
    const loadMoreProjects = () => {
        if (hasMore && !loadingMore) {
            dispatch(fetchSavedProjects({
                page: page + 1,
                limit: 20,
                search: searchTerm
            }));
        }
    };

    // Handle search
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Debounce search
        const timeoutId = setTimeout(() => {
            dispatch(resetSavedProjects());
            dispatch(fetchSavedProjects({
                page: 1,
                limit: 20,
                search: value,
                sortBy: sortBy
            }));
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Handle sort change
    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        dispatch(resetSavedProjects());
        dispatch(fetchSavedProjects({
            page: 1,
            limit: 20,
            search: searchTerm,
            sortBy: newSortBy
        }));
    };

    // Handle delete all saved projects
    const handleDeleteAll = async () => {
        try {
            await dispatch(removeAllSavedProjects()).unwrap();
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete all saved projects:', error);
        }
    };

    const handleBrowseProjects = () => {
        navigate('/projects');
    };

    const handleRefresh = () => {
        dispatch(resetSavedProjects());
        dispatch(fetchSavedProjects({
            page: 1,
            limit: 20,
            search: searchTerm,
            sortBy: sortBy
        }));
    };

    if (status === 'loading' && savedProjects.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load saved projects</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <RefreshCw className="h-4 w-4 inline mr-2" />
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                                {total} project{total !== 1 ? 's' : ''} saved
                            </div>
                            {total > 0 && (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                            <input
                                type="text"
                                placeholder="Search saved projects..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
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
                </div>

                {/* Projects List */}
                {savedProjects.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6">
                            {savedProjects.map((savedProject) => (
                                <div key={savedProject._id} className="relative">
                                    {/* Saved Badge */}
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <Bookmark className="w-3 h-3" />
                                            Saved {new Date(savedProject.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Use ProjectCard component */}
                                    <ProjectCard
                                        project={savedProject.project}
                                        viewMode="list"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={loadMoreProjects}
                                    disabled={loadingMore}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                                >
                                    {loadingMore ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Loading...
                                        </>
                                    ) : (
                                        'Load More Projects'
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                        <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No saved projects yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Save projects that interest you to easily find them later. Click the bookmark icon on any project to save it.
                        </p>
                        <button
                            onClick={handleBrowseProjects}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            Browse Projects
                        </button>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear All Saved Projects?</h3>
                            <p className="text-gray-600 mb-6">
                                This will remove all {total} saved projects from your list. This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAll}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedProjects;
