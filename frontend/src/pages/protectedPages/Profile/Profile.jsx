import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile, getProfileCompletion, clearActionSuccess } from '../../../../Redux/Slice/profileSlice';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import EditModal from './components/EditModal';
import { useProfileData } from './hooks/useProfileData';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSection, setEditSection] = useState('');
    const [formData, setFormData] = useState({});

    const { isAuthenticated } = useSelector(state => state.auth);
    const { profile, profileCompletion, actionSuccess } = useSelector(state => state.profile);
    const dispatch = useDispatch();

    // Load profile data on component mount
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getProfile());
            dispatch(getProfileCompletion());
        }
    }, [dispatch, isAuthenticated]);

    // Handle successful actions
    useEffect(() => {
        if (actionSuccess) {
            setIsEditModalOpen(false);
            setFormData({});
            setEditSection('');
            setTimeout(() => {
                dispatch(clearActionSuccess());
            }, 3000);
        }
    }, [actionSuccess, dispatch]);

    // Get processed user data
    const userData = useProfileData(profile);

    // Modal handlers
    const openEditModal = (section, initialData = {}) => {
        setEditSection(section);
        setFormData(initialData);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setFormData({});
        setEditSection('');
    };

    // Loading and authentication checks
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Profile Header */}
                <ProfileHeader
                    userData={userData}
                    profileCompletion={profileCompletion}
                    onEditProfile={() => openEditModal('profile', {
                        fullName: userData?.fullName || '',
                        professionalTitle: userData?.professionalTitle || '',
                        website: userData?.website || '',
                        phone: userData?.phone || '',
                        country: userData?.country || '',
                        city: userData?.city || '',
                        bio: userData?.bio || '',
                        hourlyRate: userData?.hourlyRate || '',
                        github: userData?.github || '',
                        linkedin: userData?.linkedin || '',
                        twitter: userData?.twitter || ''
                    })}
                />

                {/* Profile Tabs */}
                <ProfileTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userData={userData}
                    onEditModal={openEditModal}
                />

                {/* Edit Modal */}
                <EditModal
                    isOpen={isEditModalOpen}
                    section={editSection}
                    formData={formData}
                    setFormData={setFormData}
                    onClose={closeEditModal}
                    userData={userData}
                />
            </div>
        </div>
    );
};

export default Profile;
