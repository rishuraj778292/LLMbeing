

import React from 'react';
import Navbar from '../components/Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedLayout = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (loading) return <div>Loading...</div>;

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
