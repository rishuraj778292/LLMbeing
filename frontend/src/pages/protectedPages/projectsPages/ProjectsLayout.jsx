import React from 'react';
import Projectbar from '../../../components/projects/Projectbar';
import { Outlet } from 'react-router-dom';

const ProjectsLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Projects Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
          <p className="text-slate-600">
            Manage your projects, browse opportunities, and track your progress.
          </p>
        </div>

        {/* Navigation Bar */}
        <div className="mb-6">
          <Projectbar />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[600px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProjectsLayout;