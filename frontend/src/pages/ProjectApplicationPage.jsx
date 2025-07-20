import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft,
    DollarSign,
    Clock,
    FileText,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Briefcase
} from 'lucide-react';
import { fetchProjectDetails } from '../../Redux/Slice/projectSlice';
import { applyToProject } from '../../Redux/Slice/applicationSlice';

const ProjectApplicationPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProject, status } = useSelector(state => state.projects);
    const { user } = useSelector(state => state.auth);
    const { appliedProjectIds } = useSelector(state => state.applications);

    // Format budget function
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

    const [applicationData, setApplicationData] = useState({
        proposedBudget: '',
        expectedDelivery: '',
        coverLetter: '',
        attachments: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (slug && !currentProject) {
            dispatch(fetchProjectDetails(slug));
        }
    }, [dispatch, slug, currentProject]);

    // Redirect if not authenticated or not a freelancer
    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: `/project/${slug}/apply` } });
            return;
        }

        if (user.role !== 'freelancer') {
            navigate(`/project/${slug}`);
            return;
        }

        // Redirect if user has already applied to prevent navigation loops
        if (currentProject && appliedProjectIds.includes(currentProject._id)) {
            navigate(`/project/${slug}`, { replace: true });
            return;
        }
    }, [user, navigate, slug, currentProject, appliedProjectIds]);

    const validateForm = () => {
        const newErrors = {};

        if (!applicationData.proposedBudget || isNaN(applicationData.proposedBudget) || applicationData.proposedBudget <= 0) {
            newErrors.proposedBudget = 'Please enter a valid budget amount';
        }

        if (!applicationData.expectedDelivery || isNaN(applicationData.expectedDelivery) || applicationData.expectedDelivery < 1) {
            newErrors.expectedDelivery = 'Please enter a valid number of days (minimum 1)';
        }

        if (!applicationData.coverLetter.trim() || applicationData.coverLetter.length < 50) {
            newErrors.coverLetter = 'Cover letter must be at least 50 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setApplicationData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Prepare data with proper types
            const submissionData = {
                ...applicationData,
                expectedDelivery: parseInt(applicationData.expectedDelivery),
                proposedBudget: parseFloat(applicationData.proposedBudget)
            };

            await dispatch(applyToProject({
                projectId: currentProject._id,
                applicationData: submissionData
            })).unwrap();

            setSubmitStatus('success');

        } catch (error) {
            setSubmitStatus('error');
            console.error('Application submission failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success Modal Component
    const SuccessModal = () => {
        if (submitStatus !== 'success') return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Application Submitted Successfully!
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Your proposal has been sent to the client. You'll be notified when they respond.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/projects')}
                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse More Projects
                            </button>
                            <button
                                onClick={() => navigate('/my-applications')}
                                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                View My Applications
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (status === 'loading' || !currentProject) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Check if user has already applied using Redux state
    const hasApplied = currentProject && appliedProjectIds.includes(currentProject._id);

    if (hasApplied) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Applied</h2>
                    <p className="text-gray-600 mb-4">You have already applied to this project.</p>
                    <button
                        onClick={() => navigate(`/project/${slug}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        View Project
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate(`/project/${slug}`)}
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Project
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Application Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900">Apply for Project</h1>
                                <p className="text-gray-600 mt-1">Submit your proposal for this project</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Success/Error Messages */}
                                {submitStatus === 'success' && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                                        <span className="text-green-700">Application submitted successfully! Redirecting...</span>
                                    </div>
                                )}

                                {submitStatus === 'error' && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                        <span className="text-red-700">Failed to submit application. Please try again.</span>
                                    </div>
                                )}

                                {/* Proposed Budget */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Proposed Budget (USD) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            value={applicationData.proposedBudget}
                                            onChange={(e) => handleInputChange('proposedBudget', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.proposedBudget ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter your proposed budget"
                                        />
                                    </div>
                                    {errors.proposedBudget && (
                                        <p className="mt-1 text-sm text-red-600">{errors.proposedBudget}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        Project budget: {formatBudget(currentProject.budget)}
                                    </p>
                                </div>

                                {/* Estimated Duration */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Duration (Days) *
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={applicationData.expectedDelivery}
                                            onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.expectedDelivery ? 'border-red-300' : 'border-gray-300'
                                                }`}
                                            placeholder="Enter number of days (e.g., 7, 14, 30)"
                                        />
                                    </div>
                                    {errors.expectedDelivery && (
                                        <p className="mt-1 text-sm text-red-600">{errors.expectedDelivery}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        How many days do you need to complete this project?
                                    </p>
                                </div>

                                {/* Cover Letter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Cover Letter *
                                    </label>
                                    <textarea
                                        value={applicationData.coverLetter}
                                        onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                                        rows={6}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.coverLetter ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Tell the client why you're the best fit for this project. Highlight relevant experience, skills, and your approach to completing the work."
                                    />
                                    {errors.coverLetter && (
                                        <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
                                    )}
                                    <p className="mt-1 text-sm text-gray-500">
                                        {applicationData.coverLetter.length}/500 characters (minimum 50)
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/project/${slug}`)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            'Submit Application'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Project Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-1">{currentProject.title}</h4>
                                    <p className="text-sm text-gray-600 line-clamp-3">{currentProject.description}</p>
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Budget: {formatBudget(currentProject.budget)}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <Briefcase className="h-4 w-4 mr-2" />
                                    {currentProject.projectType || 'Freelance'}
                                </div>

                                <div className="flex items-center text-sm text-gray-600">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {currentProject.applicationsCount || 0} proposals
                                </div>

                                {currentProject.skillsRequired && currentProject.skillsRequired.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Skills Required</p>
                                        <div className="flex flex-wrap gap-1">
                                            {currentProject.skillsRequired.slice(0, 5).map((skill, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                            {currentProject.skillsRequired.length > 5 && (
                                                <span className="text-xs text-gray-500 py-1">
                                                    +{currentProject.skillsRequired.length - 5} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Application Tips */}
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Application Tips</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Be specific about your approach and timeline</li>
                                <li>• Highlight relevant experience and skills</li>
                                <li>• Ask clarifying questions if needed</li>
                                <li>• Showcase your relevant work experience</li>
                                <li>• Be competitive but realistic with your pricing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            <SuccessModal />
        </div>
    );
};

export default ProjectApplicationPage;
