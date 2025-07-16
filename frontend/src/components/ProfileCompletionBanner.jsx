import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    X,
    ArrowRight,
    CheckCircle,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Globe
} from 'lucide-react';

const ProfileCompletionBanner = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [profileCompletion, setProfileCompletion] = useState(0);
    const [missingFields, setMissingFields] = useState([]);
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Check if banner was previously dismissed
    useEffect(() => {
        const dismissed = localStorage.getItem('profileBannerDismissed');
        if (dismissed === 'true') {
            setIsVisible(false);
        }
    }, []);

    // Calculate profile completion and missing fields
    useEffect(() => {
        if (!user) return;

        const fields = [
            { key: 'fullName', label: 'Full Name', icon: User, value: user?.fullName },
            { key: 'email', label: 'Email', icon: Mail, value: user?.email },
            { key: 'bio', label: 'Bio/About', icon: User, value: user?.bio },
            { key: 'skills', label: 'Skills', icon: Briefcase, value: user?.skills?.length > 0 },
            { key: 'country', label: 'Country', icon: MapPin, value: user?.country },
            { key: 'profileImage', label: 'Profile Picture', icon: User, value: user?.profileImage },
            { key: 'phone', label: 'Phone Number', icon: Phone, value: user?.phone },
            { key: 'website', label: 'Website', icon: Globe, value: user?.website },
        ];

        const completedFields = fields.filter(field => field.value).length;
        const completion = Math.round((completedFields / fields.length) * 100);
        const missing = fields.filter(field => !field.value);

        setProfileCompletion(completion);
        setMissingFields(missing);
    }, [user]);

    // Don't show banner if profile is complete or user dismissed it
    if (!isVisible || profileCompletion >= 100) {
        return null;
    }

    const handleGoToProfile = () => {
        navigate('/profile');
    };

    const handleDismiss = () => {
        setIsVisible(false);
        // In a real app, you might want to save this preference to localStorage or backend
        localStorage.setItem('profileBannerDismissed', 'true');
    };

    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-40 h-40 bg-amber-500 rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500 rounded-full translate-x-16 translate-y-16"></div>
            </div>

            {/* Dismiss Button */}
            <button
                onClick={handleDismiss}
                className="absolute top-4 right-4 p-1 text-amber-600 hover:text-amber-800 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="relative">
                <div className="flex items-start space-x-4">
                    {/* Warning Icon */}
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-amber-900 mb-1">
                                    Complete Your Profile ({profileCompletion}%)
                                </h3>
                                <p className="text-amber-800 mb-3">
                                    A complete profile helps you attract more {user?.role === 'freelancer' ? 'clients' : 'freelancers'} and build trust.
                                    You're missing some important information.
                                </p>

                                {/* Progress Bar */}
                                <div className="w-full bg-amber-200 rounded-full h-2 mb-4">
                                    <div
                                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${profileCompletion}%` }}
                                    />
                                </div>

                                {/* Missing Fields */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {missingFields.slice(0, 4).map((field) => {
                                        const IconComponent = field.icon;
                                        return (
                                            <div
                                                key={field.key}
                                                className="flex items-center space-x-1 bg-white bg-opacity-60 px-3 py-1 rounded-full text-sm text-amber-800"
                                            >
                                                <IconComponent className="w-3 h-3" />
                                                <span>{field.label}</span>
                                            </div>
                                        );
                                    })}
                                    {missingFields.length > 4 && (
                                        <div className="flex items-center bg-white bg-opacity-60 px-3 py-1 rounded-full text-sm text-amber-800">
                                            <span>+{missingFields.length - 4} more</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="flex-shrink-0 mt-4 lg:mt-0 lg:ml-6">
                                <button
                                    onClick={handleGoToProfile}
                                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    <span>Complete Profile</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="mt-6 pt-4 border-t border-amber-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-amber-800">
                            <CheckCircle className="w-4 h-4 text-amber-600" />
                            <span>Increase visibility to {user?.role === 'freelancer' ? 'clients' : 'talent'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-amber-800">
                            <CheckCircle className="w-4 h-4 text-amber-600" />
                            <span>Build trust and credibility</span>
                        </div>
                        <div className="flex items-center space-x-2 text-amber-800">
                            <CheckCircle className="w-4 h-4 text-amber-600" />
                            <span>Get better project matches</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionBanner;
