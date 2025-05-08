// import React from 'react'
// import Navbar from '../components/Navbar'
// import { Navigate, Outlet } from 'react-router-dom'
// import { useSelector } from 'react-redux'
// import Sidebar from '../components/Sidebar'


// const ProtectedLayout = () => {
//     const { isAuthenticated, loading } = useSelector((state) => state.auth)
//     if (!isAuthenticated) return <Navigate to="/login" />;
//     if (loading) return <div>Loading...</div>

//     return (
//         <div>
//             <Navbar/>
//            <div className='flex mt-20  px-20'>
//            <Sidebar/>
//             <main className='h-screen border border-gray-400 rounded-md '>
//                 <Outlet />
//             </main>
//            </div>
//         </div>
//     )
// }

// export default ProtectedLayout;

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


            <main className="bg-white px-20 pt-25">
                <Outlet />
            </main>
        </div>

    );
};

export default ProtectedLayout;
