import React from 'react';
import Projectbar from '../../../components/projects/Projectbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProjectsLayout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageTitle = () => {
    if (location.pathname.startsWith('/manage-projects')) {
      return user?.role === 'client' ? 'Manage Your Projects' : 'Manage Projects';
    }
    return 'Find Projects';
  };

  const getPageDescription = () => {
    if (location.pathname.startsWith('/manage-projects')) {
      return user?.role === 'client'
        ? 'Track and manage your posted projects, view applications, and monitor progress.'
        : 'Manage your saved projects, applications, and track your work progress.';
    }
    return 'Discover and browse exciting project opportunities that match your skills.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Projects Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3">{getPageTitle()}</h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                {getPageDescription()}
              </p>
            </div>

            {/* Quick Stats for Manage Projects */}
            {location.pathname.startsWith('/manage-projects') && (
              <div className="hidden lg:flex space-x-6">
                {user?.role === 'freelancer' ? (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-slate-500">Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-sm text-slate-500">Applied</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">3</div>
                      <div className="text-sm text-slate-500">Active</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">8</div>
                      <div className="text-sm text-slate-500">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">37</div>
                      <div className="text-sm text-slate-500">Completed</div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="mb-8">
          <Projectbar />
        </div>

        {/* Enhanced Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/60 min-h-[700px] overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectsLayout;