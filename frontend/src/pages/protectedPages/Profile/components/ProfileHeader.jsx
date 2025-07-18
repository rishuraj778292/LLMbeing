import React from 'react';
import { Camera, Edit, MapPin, Calendar, Shield, DollarSign } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { uploadProfilePicture } from '../../../../../Redux/Slice/profileSlice';

const ProfileHeader = ({ userData, profileCompletion, onEditProfile }) => {
    const dispatch = useDispatch();

    const handleUploadProfilePicture = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await dispatch(uploadProfilePicture(file)).unwrap();
                } catch (error) {
                    console.error('Profile picture upload failed:', error);
                }
            }
        };
        input.click();
    };

    const profileCompletionPercentage = profileCompletion?.completionPercentage || 0;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="px-4 sm:px-6 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                    {/* Profile Picture with Completion Ring */}
                    <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
                        <div className="relative">
                            {/* Completion Ring */}
                            <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 45}`}
                                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - profileCompletionPercentage / 100)}`}
                                    className="text-blue-500 transition-all duration-500"
                                    strokeLinecap="round"
                                />
                            </svg>

                            {/* Profile Image */}
                            <div className="absolute inset-2 rounded-full overflow-hidden bg-white border-4 border-white shadow-md">
                                {userData.avatar ? (
                                    <img
                                        src={userData.avatar}
                                        alt={userData.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white text-2xl font-semibold">
                                            {userData.name?.charAt(0)?.toUpperCase() || userData.userName?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Camera Button */}
                            <button
                                onClick={handleUploadProfilePicture}
                                className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Profile Completion Info */}
                        {profileCompletionPercentage < 100 && (
                            <div className="mt-3 text-center sm:text-left">
                                <div className="text-sm font-medium text-gray-700">{profileCompletionPercentage}% Complete</div>
                                <div className="text-xs text-gray-500">Complete your profile</div>
                            </div>
                        )}
                    </div>

                    {/* Profile Information */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">{userData.name || userData.userName}</h1>
                                    {userData.isProfileVerified && (
                                        <div className="flex items-center justify-center sm:justify-start space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full mt-2 sm:mt-0 self-center sm:self-auto">
                                            <Shield className="w-3 h-3" />
                                            <span className="text-xs font-medium">Verified</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-base sm:text-lg text-gray-600 mb-3 font-medium text-center sm:text-left">
                                    {userData.title || 'Add your professional title'}
                                </p>

                                {/* Bio Preview */}
                                {userData.bio && (
                                    <p className="text-gray-700 mb-4 line-clamp-2 text-center sm:text-left text-sm sm:text-base">{userData.bio}</p>
                                )}
                            </div>

                            <button
                                onClick={onEditProfile}
                                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm w-full sm:w-auto cursor-pointer"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit Profile</span>
                            </button>
                        </div>

                        {/* Key Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                            {userData.country && (
                                <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">{userData.country}{userData.city ? `, ${userData.city}` : ''}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">Joined {userData.joinDate}</span>
                            </div>

                            {userData.hourlyRate && (
                                <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600 sm:col-span-2 lg:col-span-1">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium">${userData.hourlyRate}/hour</span>
                                </div>
                            )}
                        </div>

                        {/* Skills Preview */}
                        {userData.skills && userData.skills.length > 0 && (
                            <div className="mt-4">
                                <div className="flex flex-wrap gap-2">
                                    {userData.skills.slice(0, 5).map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {userData.skills.length > 5 && (
                                        <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-sm">
                                            +{userData.skills.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
