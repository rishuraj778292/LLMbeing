

import React from 'react';
import Navbar from '../components/Navbar';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedLayout = () => {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);

    if (!isAuthenticated) return <Navigate to="/login" />;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col h-screen">
            {/* Navbar fixed at top */}
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>

    );
};

export default ProtectedLayout;
