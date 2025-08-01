import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Pencil, Trash2, AlertTriangle, Eye, ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import { fetchOwnProjects, deleteProject } from '../../../../Redux/Slice/projectSlice';
import { getRelativeTime, formatBudget, formatLocation } from '../../../utils/formatters';

const MyProjects = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { ownProjects: userProjects, loading } = useSelector((state) => state.projects);

    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        // Load user projects
        dispatch(fetchOwnProjects());
    }, [dispatch]);

    // Filter projects based on search term and status
    const filteredProjects = userProjects.filter((project) => {
        const matchesSearch =
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'all' || project.projectStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Pagination
    const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleEditProject = (projectId) => {
        navigate(`/project/${projectId}/edit`);
    };

    const handleViewProject = (slug) => {
        navigate(`/project/${slug}`);
    };

    const handleDeleteRequest = (project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;

        try {
            setIsDeleting(true);
            await dispatch(deleteProject(projectToDelete._id)).unwrap();
            setShowDeleteModal(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateProject = () => {
        navigate('/projects/new');
    };

    const statusOptions = [
        { value: 'all', label: 'All Projects' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'draft', label: 'Draft' },
        { value: 'closed', label: 'Closed' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-50 text-green-700 border-green-200';
            case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'completed': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'draft': return 'bg-gray-50 text-gray-700 border-gray-200';
            case 'closed': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
                            <p className="text-gray-600">Manage all the projects you've posted</p>
                        </div>
                        <button
                            onClick={handleCreateProject}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Post New Project</span>
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search projects..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Projects List */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    </div>
                ) : paginatedProjects.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {paginatedProjects.map((project) => (
                            <div key={project._id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3
                                            onClick={() => handleViewProject(project.slug || project._id)}
                                            className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                        >
                                            {project.title}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.projectStatus)}`}>
                                            {project.projectStatus === 'in_progress' ? 'In Progress' :
                                                project.projectStatus.charAt(0).toUpperCase() + project.projectStatus.slice(1)}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                        <div className="flex items-center space-x-1">
                                            <Eye className="w-4 h-4" />
                                            <span>{project.stats?.viewCount || 0} views</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <PlusCircle className="w-4 h-4" />
                                            <span>{project.stats?.applicationCount || 0} applications</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                                        {project.description || 'No description available'}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Budget</p>
                                            <div className="font-medium text-gray-900">{formatBudget(project.budget)}</div>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Location</p>
                                            <div className="font-medium text-gray-900">{formatLocation(project.location)}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.skillsRequired && project.skillsRequired.slice(0, 3).map((skill, index) => (
                                            <span key={index} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                        {project.skillsRequired && project.skillsRequired.length > 3 && (
                                            <span className="text-xs text-gray-500 px-2 py-1">
                                                +{project.skillsRequired.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <button
                                            onClick={() => handleViewProject(project.slug || project._id)}
                                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View</span>
                                        </button>

                                        <button
                                            onClick={() => handleEditProject(project._id)}
                                            className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            onClick={() => handleDeleteRequest(project)}
                                            className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="text-center py-16 px-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
                            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                                {searchTerm || statusFilter !== 'all'
                                    ? "No projects match your current filters. Try adjusting your search criteria or clear filters to see all your projects."
                                    : "You haven't posted any projects yet. Start by posting your first project to find talented freelancers."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {(searchTerm || statusFilter !== 'all') ? (
                                    <button
                                        onClick={() => {
                                            setSearchTerm('');
                                            setStatusFilter('all');
                                        }}
                                        className="px-6 py-3 text-blue-600 hover:text-blue-700 font-medium border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                                    >
                                        Clear filters
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleCreateProject}
                                        className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                                    >
                                        Post Your First Project
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg border ${currentPage === 1 ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`w-10 h-10 rounded-lg ${currentPage === index + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg border ${currentPage === totalPages ? 'text-gray-400 border-gray-200 cursor-not-allowed' : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
                        <div className="flex items-center mb-4 text-red-600">
                            <AlertTriangle className="w-6 h-6 mr-2" />
                            <h3 className="text-xl font-bold">Delete Project</h3>
                        </div>

                        <p className="text-gray-700 mb-3">
                            Are you sure you want to delete <span className="font-semibold">{projectToDelete?.title}</span>?
                        </p>
                        <p className="text-gray-700 mb-6">
                            This action cannot be undone. All associated applications and data will be permanently removed.
                        </p>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setProjectToDelete(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <>
                                        <span className="mr-2">Deleting...</span>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </>
                                ) : (
                                    'Delete Project'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProjects;
