

import React from 'react';
import Navbar from '../components/Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedLayout = () => {
    const { isAuthenticated, verifyStatus } = useSelector((state) => state.auth);

    // Show loading while verifying authentication or if verification hasn't started
    if (verifyStatus === 'loading' || verifyStatus === 'idle') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated after verification is complete
    if (verifyStatus === 'failed' || (verifyStatus === 'succeeded' && !isAuthenticated)) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar fixed at top */}
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)] overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default ProtectedLayout;
