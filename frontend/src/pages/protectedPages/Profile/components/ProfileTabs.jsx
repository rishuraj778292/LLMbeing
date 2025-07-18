import React from 'react';
import OverviewTab from '../tabs/OverviewTab';
import ProjectsTab from '../tabs/ProjectsTab';
import ExperienceTab from '../tabs/ExperienceTab';
import EducationTab from '../tabs/EducationTab';
import ReviewsTab from '../tabs/ReviewsTab';

const ProfileTabs = ({ activeTab, setActiveTab, userData, onEditModal }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'projects', label: 'Projects & Portfolio' },
        { id: 'experience', label: 'Experience' },
        { id: 'education', label: 'Education' },
        { id: 'reviews', label: 'Reviews' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab userData={userData} onEditModal={onEditModal} />;
            case 'projects':
                return <ProjectsTab userData={userData} onEditModal={onEditModal} />;
            case 'experience':
                return <ExperienceTab userData={userData} onEditModal={onEditModal} />;
            case 'education':
                return <EducationTab userData={userData} onEditModal={onEditModal} />;
            case 'reviews':
                return <ReviewsTab userData={userData} />;
            default:
                return <OverviewTab userData={userData} onEditModal={onEditModal} />;
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto px-4 sm:px-6 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProfileTabs;
