import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Clock,
    MapPin,
    User,
    DollarSign,
    Heart,
    BookmarkPlus,
    ThumbsDown,
    ArrowLeft,
    Share2,
    Flag,
    Calendar,
    Briefcase,
    Users,
    Star,
    CheckCircle,
    AlertCircle,
    ExternalLink
} from 'lucide-react';
import {
    fetchProjectDetails,
    toggleLike,
    toggleDislike,
    toggleBookmark,
    updateProjectInteraction,
    clearCurrentProject
} from '../../Redux/Slice/projectSlice';
import { getCategoryLabel } from '../utils/aiCategories';

const ProjectDetailsPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProject, status, error } = useSelector(state => state.projects);
    const { user } = useSelector(state => state.auth);
    const { appliedProjectIds } = useSelector(state => state.applications);
    const [showFullDescription, setShowFullDescription] = useState(false);

    useEffect(() => {
        if (slug) {
            dispatch(fetchProjectDetails(slug));
        }

        return () => {
            dispatch(clearCurrentProject());
        };
    }, [dispatch, slug]);

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

        // Legacy format handling
        const numericBudget = typeof budget === 'number' ? budget : parseFloat(budget);
        if (isNaN(numericBudget)) return budget;
        return `$${numericBudget.toLocaleString()}`;
    };

    const getRelativeTime = (postedAt) => {
        if (!postedAt) return "Recently posted";
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
    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        dispatch(updateProjectInteraction({
            projectId: currentProject._id,
            type: 'like',
            isActive: !currentProject.isLiked
        }));

        try {
            await dispatch(toggleLike(currentProject._id)).unwrap();
        } catch {
            dispatch(updateProjectInteraction({
                projectId: currentProject._id,
                type: 'like',
                isActive: currentProject.isLiked
            }));
        }
    };

    const handleDislike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        dispatch(updateProjectInteraction({
            projectId: currentProject._id,
            type: 'dislike',
            isActive: !currentProject.isDisliked
        }));

        try {
            await dispatch(toggleDislike(currentProject._id)).unwrap();
        } catch {
            dispatch(updateProjectInteraction({
                projectId: currentProject._id,
                type: 'dislike',
                isActive: currentProject.isDisliked
            }));
        }
    };

    const handleBookmark = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        dispatch(updateProjectInteraction({
            projectId: currentProject._id,
            type: 'bookmark',
            isActive: !currentProject.isBookmarked
        }));

        try {
            await dispatch(toggleBookmark(currentProject._id)).unwrap();
        } catch {
            dispatch(updateProjectInteraction({
                projectId: currentProject._id,
                type: 'bookmark',
                isActive: currentProject.isBookmarked
            }));
        }
    };

    const handleApply = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/project/${slug}/apply`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentProject.title,
                    text: currentProject.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You could show a toast notification here
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (status === 'failed' || !currentProject) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
                    <p className="text-gray-600 mb-4">{error || 'The project you are looking for does not exist.'}</p>
                    <button
                        onClick={() => navigate('/projects')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Back to Projects
                    </button>
                </div>
            </div>
        );
    }

    const isOwner = user && currentProject.createdBy === user._id;
    const hasApplied = currentProject && appliedProjectIds.includes(currentProject._id);
    const canApply = user && user.role === 'freelancer' && !isOwner && !hasApplied;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Navigation */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Projects
                        </button>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleShare}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <Share2 className="h-5 w-5" />
                            </button>

                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                <Flag className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Header */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                    {currentProject.title}
                                </h1>

                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleLike}
                                        className={`p-2 rounded-lg transition-colors ${currentProject.isLiked
                                            ? 'text-red-500 bg-red-50'
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        <Heart className={`h-5 w-5 ${currentProject.isLiked ? 'fill-current' : ''}`} />
                                    </button>

                                    <button
                                        onClick={handleDislike}
                                        className={`p-2 rounded-lg transition-colors ${currentProject.isDisliked
                                            ? 'text-orange-500 bg-orange-50'
                                            : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                                            }`}
                                    >
                                        <ThumbsDown className={`h-5 w-5 ${currentProject.isDisliked ? 'fill-current' : ''}`} />
                                    </button>

                                    <button
                                        onClick={handleBookmark}
                                        className={`p-2 rounded-lg transition-colors ${currentProject.isBookmarked
                                            ? 'text-blue-500 bg-blue-50'
                                            : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                            }`}
                                    >
                                        <BookmarkPlus className={`h-5 w-5 ${currentProject.isBookmarked ? 'fill-current' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Project Meta */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Posted {getRelativeTime(currentProject.createdAt)}
                                </div>

                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {formatLocation(currentProject.location)}
                                </div>

                                <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    {currentProject.projectType || 'Freelance'}
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {currentProject.experienceLevel || 'Any Level'}
                                </div>
                            </div>

                            {/* Budget */}
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Project Budget</h3>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatBudget(currentProject.budget)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        {currentProject.applicationsCount || 0} proposals
                                    </p>
                                </div>
                            </div>

                            {/* Project Description */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Description</h3>
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {showFullDescription
                                            ? currentProject.description
                                            : currentProject.description?.slice(0, 500) + (currentProject.description?.length > 500 ? '...' : '')
                                        }
                                    </p>

                                    {currentProject.description?.length > 500 && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                                        >
                                            {showFullDescription ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Skills Required */}
                            {currentProject.skillsRequired && currentProject.skillsRequired.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Skills Required</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProject.skillsRequired.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            {currentProject.projectCategory && currentProject.projectCategory.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProject.projectCategory.map((category, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                                            >
                                                {getCategoryLabel(category)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Information */}
                        {currentProject.proposal && (
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proposal Requirements</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {currentProject.proposal}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Apply Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Take Action</h3>

                            {canApply && (
                                <button
                                    onClick={handleApply}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center"
                                >
                                    <ExternalLink className="h-5 w-5 mr-2" />
                                    Apply for this Project
                                </button>
                            )}

                            {hasApplied && (
                                <div className="space-y-2">
                                    <div className="w-full bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg flex items-center justify-center">
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Application Submitted
                                    </div>
                                    <button
                                        onClick={() => navigate('/manage-projects/applied')}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        View My Application
                                    </button>
                                </div>
                            )}

                            {isOwner && (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => navigate(`/project/${slug}/edit`)}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        Edit Project
                                    </button>
                                    <button
                                        onClick={() => navigate(`/project/${slug}/applications`)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                                    >
                                        View Applications ({currentProject.applicationsCount || 0})
                                    </button>
                                </div>
                            )}

                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Login to Apply
                                </button>
                            )}
                        </div>

                        {/* Client Information */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h3>

                            <div className="flex items-center mb-4">
                                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    {currentProject.clientAvatar ? (
                                        <img
                                            src={currentProject.clientAvatar}
                                            alt={currentProject.clientName || 'Client'}
                                            className="h-12 w-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="h-6 w-6 text-blue-600" />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">
                                        {currentProject.clientName || 'Client'}
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        {currentProject.clientLocation || 'Client'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Member since</span>
                                    <span className="font-medium">
                                        {getRelativeTime(currentProject.clientJoinDate || currentProject.createdAt)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Projects posted</span>
                                    <span className="font-medium">{currentProject.clientProjectsCount || 1}</span>
                                </div>
                            </div>
                        </div>

                        {/* Project Stats */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Activity</h3>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-blue-500 mr-2" />
                                        <span className="text-sm text-gray-600">Posted</span>
                                    </div>
                                    <span className="font-semibold">{getRelativeTime(currentProject.createdAt)}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 text-blue-500 mr-2" />
                                        <span className="text-sm text-gray-600">Applications</span>
                                    </div>
                                    <span className="font-semibold">{currentProject.applicationsCount || 0}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BookmarkPlus className="h-4 w-4 text-blue-500 mr-2" />
                                        <span className="text-sm text-gray-600">Bookmarks</span>
                                    </div>
                                    <span className="font-semibold">{currentProject.bookmarksCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailsPage;
