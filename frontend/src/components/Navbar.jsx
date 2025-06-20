// import React, { useState } from 'react';
// import { useSelector,useDispatch } from 'react-redux';
// import { assets } from '../assets/assets';
// import {logout} from '../../Redux/Slice/authSlice'
// import { NavLink } from 'react-router-dom';

// const Navbar = ({ isAuthPage }) => {
//     const dispatch = useDispatch();
//     const activeClassName = "bg-indigo-600 px-5 py-2"
//     const { user, isAuthenticated } = useSelector((state) => state.auth);
//     console.log("Navbar user:", user);
//     const [isAccountPannelExpanded, setisAccountPannelExpanded] = useState(false)
//     const handleAccountPannel = () => {
//         if (isAccountPannelExpanded === true) {
//             setisAccountPannelExpanded(false);
//         }
//         else {
//             setisAccountPannelExpanded(true);
//         }
//     }
//     return (
//         <div className='fixed top-0 left-0 right-0 z-50   bg-white flex items-center  py-2 px-5'>
//             <div className='cursor-pointer '>
//                 <a href='/' className='font-bold text-xl '>
//                     LLMbeing
//                 </a>
//             </div>

//             {!isAuthPage &&
//                 (isAuthenticated ? (
//                     // free lancer  navbar
//                     (user.role === "freelancer" ? (
//                         <div className="flex   items-center  justify-between">
//                             <div>
//                                 <NavLink>Dashboard</NavLink>
//                                 <NavLink>Projects</NavLink>
//                                 <NavLink>Your gigs</NavLink>
//                                 <NavLink>Message</NavLink>
//                             </div>

//                             <div className="flex  items-center  gap-10  relative">
//                                 <img src={assets.notification} alt="" className="w-5 h-5" />
//                                 <div className="flex justify-center items-center gap-1" onClick={handleAccountPannel}>
//                                     <img src={assets.user_icon} alt="" className="w-7 h-7" />
//                                     <p>{user.userName}</p>
//                                     {isAccountPannelExpanded ?
//                                         <img src={assets.up_arrow} alt="" className="w-5 h-5" />
//                                         :
//                                         <img src={assets.down_arrow} alt="" className="w-5 h-5" />}
//                                 </div>
//                                 {isAccountPannelExpanded &&
//                                     <div className='absolute top-10  right-0   flex flex-col justify-center  gap-3 bg-white border border-gray-400 rounded-2xl p-5 w-50 '>
//                                         <div>Account</div>
//                                         <div className='flex flex-col justify-center pl-5 gap-3'>
//                                             <NavLink to="/profile" className='hover:text-indigo-500' onClick={handleAccountPannel}>Profile</NavLink>
//                                             <NavLink to="/account-setting" className='hover:text-indigo-500'>setting</NavLink>
//                                             <NavLink className='hover:text-indigo-500' onClick={()=>dispatch(logout())}>Log out</NavLink>
//                                         </div>
//                                     </div>

//                                 }

//                             </div>
//                         </div>
//                     ) :

//                         // client navbar
//                         user.role === "client" ? (
//                             <div className="flex justify-between  items-center ">

//                                 <div className="flex  items-center  gap-10  relative">
//                                     <img src={assets.notification} alt="" className="w-5 h-5" />
//                                     <div className="flex justify-center items-center gap-1" onClick={handleAccountPannel}>
//                                         <img src={assets.user_icon} alt="" className="w-7 h-7" />
//                                         {isAccountPannelExpanded ?
//                                             <img src={assets.up_arrow} alt="" className="w-5 h-5" />
//                                             :
//                                             <img src={assets.down_arrow} alt="" className="w-5 h-5" />}
//                                     </div>
//                                     {isAccountPannelExpanded &&
//                                         <div className='absolute top-10  right-1.2   flex flex-col justify-center items-center gap-3 bg-white border-2 rounded-2xl p-5 '>
//                                             <NavLink to="/account-setting" className='' onClick={handleAccountPannel}>My account</NavLink>
//                                             <button onClick={dispatch(logout)}>Log out</button>
//                                         </div>

//                                     }

//                                 </div>
//                             </div>
//                         ) :


//                             // admin navbar
//                             (
//                                 <div className="flex justify-between  items-center ">

//                                     <div className="flex  items-center  gap-10 ">
//                                         <img src={assets.notification} alt="" className="w-5 h-5" />
//                                         <div className="flex justify-center items-center gap-1">
//                                             <img src={assets.user_icon} alt="" className="w-7 h-7" />
//                                             <img src={assets.down_arrow} alt="" className="w-5 h-5" />
//                                         </div>

//                                     </div>
//                                 </div>
//                             ))

//                 ) : (
//                     <div className='flex justify-between items-center w-[100%] text-md pl-5'>
//                         <div className='flex gap-5 items-center text-md'>

//                             <NavLink to="/login">Hire AI talent</NavLink>
//                             <NavLink to="/login">Our AI Work</NavLink>
//                             <NavLink to='/aboutus'>Why  Choose  LLMbeing</NavLink>
//                             <NavLink>Pricing</NavLink>



//                         </div>
//                         <div className=' flex gap-5 justify-center items-center'>
//                             <a href='/login' className='cursor-pointer'>
//                                 Log in
//                             </a>
//                             <a
//                                 href='/signup'
//                                 className='cursor-pointer px-5 bg-indigo-500  hover:bg-indigo-600 rounded-md py-2'
//                             >
//                                 Sign up
//                             </a>
//                         </div>
//                     </div>
//                 ))}
//         </div>
//     );
// };

// export default Navbar;


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assets } from '../assets/assets';
import { logout } from '../../Redux/Slice/authSlice';
import { NavLink } from 'react-router-dom';

const Navbar = ({ isAuthPage }) => {
    const dispatch = useDispatch();
    const activeClassName = "bg-indigo-600 text-white px-5 py-2 rounded";
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    console.log(user)
    const [isAccountPanelExpanded, setIsAccountPanelExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close panels when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isAccountPanelExpanded && !event.target.closest('.account-panel-container')) {
                setIsAccountPanelExpanded(false);
            }
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container') &&
                !event.target.closest('.hamburger')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isAccountPanelExpanded, isMobileMenuOpen]);

    const handleAccountPanel = () => {
        setIsAccountPanelExpanded(!isAccountPanelExpanded);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsAccountPanelExpanded(false);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md'>
            <div className='container mx-auto flex items-center justify-between py-3 px-4 md:px-6'>
                {/* Logo */}
                <div className='cursor-pointer'>
                    <a href='/' className='font-bold text-xl'>
                        LLMbeing
                    </a>
                </div>

                {/* Hamburger menu for mobile */}
                {!isAuthPage && (
                    <div className='md:hidden hamburger'>
                        <button onClick={toggleMobileMenu} className='p-2'>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Desktop Navigation */}
                {!isAuthPage && (
                    <div className='hidden md:block w-full pl-5'>
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between w-full">
                                {/* Freelancer Navigation Links */}
                                {user?.role === "freelancer" && (
                                    <div className="flex items-center space-x-6">
                                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
                                        <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Projects</NavLink>
                                        <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Your gigs</NavLink>
                                        <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
                                    </div>
                                )}
                                {user?.role === "client" && (
                                    <div className="flex items-center space-x-6">
                                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
                                        <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Your Projects</NavLink>
                                        <NavLink to="/post-project" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Post Projects</NavLink>
                                        <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>gigs</NavLink>
                                        <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
                                    </div>
                                )}
                                {user?.role === "admin" && (
                                    <div className="flex items-center space-x-6">
                                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
                                        <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Projects</NavLink>
                                        <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>gigs</NavLink>
                                        <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
                                    </div>
                                )}

                                {/* User Controls - Notification and Account */}
                                <div className="flex items-center gap-6 ml-auto account-panel-container">
                                    <button className="relative">
                                        <img src={assets.notification} alt="Notifications" className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-2 cursor-pointer" onClick={handleAccountPanel}>
                                        <img src={user.profileImage === ""
                                            ? assets.user_icon : user.profileImage
                                        } alt="User" className="w-7 h-7" />
                                        {user?.userName && <p className="hidden sm:block">{user.userName}</p>}
                                        <img
                                            src={isAccountPanelExpanded ? assets.up_arrow : assets.down_arrow}
                                            alt="Toggle account menu"
                                            className="w-4 h-4"
                                        />
                                    </div>

                                    {/* Account Panel Dropdown */}
                                    {isAccountPanelExpanded && (
                                        <div className='absolute top-14 right-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48 z-50'>
                                            <h3 className="font-medium mb-2">Account</h3>
                                            <div className='flex flex-col space-y-2'>
                                                <NavLink
                                                    to="/profile"
                                                    className='hover:text-indigo-500 py-1'
                                                    onClick={() => setIsAccountPanelExpanded(false)}
                                                >
                                                    Profile
                                                </NavLink>
                                                <NavLink
                                                    to="/account-setting"
                                                    className='hover:text-indigo-500 py-1'
                                                    onClick={() => setIsAccountPanelExpanded(false)}
                                                >
                                                    Settings
                                                </NavLink>
                                                <button
                                                    className='text-left hover:text-indigo-500 py-1'
                                                    onClick={handleLogout}
                                                >
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className='flex justify-between items-center w-full'>
                                <div className='flex gap-6 items-center'>
                                    <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
                                        Hire AI talent
                                    </NavLink>
                                    <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
                                        Our AI Work
                                    </NavLink>
                                    <NavLink to='/aboutus' className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
                                        Why Choose LLMbeing
                                    </NavLink>
                                    <NavLink to="/pricing" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
                                        Pricing
                                    </NavLink>
                                </div>

                                <div className='flex gap-4 items-center'>
                                    <NavLink to='/login' className='hover:text-indigo-600'>
                                        Log in
                                    </NavLink>
                                    <NavLink
                                        to='/signup'
                                        className='bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-5 py-2'
                                    >
                                        Sign up
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Navigation Menu */}
            {!isAuthPage && isMobileMenuOpen && (
                <div className="md:hidden mobile-menu-container">
                    <div className="bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
                        {isAuthenticated ? (
                            <div className="flex flex-col space-y-4">
                                {/* Freelancer Navigation Links */}
                                {user?.role === "freelancer" && (
                                    <>
                                        <NavLink
                                            to="/dashboard"
                                            className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Dashboard
                                        </NavLink>
                                        <NavLink
                                            to="/projects"
                                            className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Projects
                                        </NavLink>
                                        <NavLink
                                            to="/gigs"
                                            className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Your gigs
                                        </NavLink>
                                        <NavLink
                                            to="/messages"
                                            className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Message
                                        </NavLink>
                                    </>
                                )}

                                {/* User Account Links */}
                                <div className="pt-2 border-t border-gray-200">
                                    <h3 className="font-medium mb-2">Account</h3>
                                    <NavLink
                                        to="/profile"
                                        className="block py-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </NavLink>
                                    <NavLink
                                        to="/account-setting"
                                        className="block py-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Settings
                                    </NavLink>
                                    <button
                                        className="block py-1 text-left w-full"
                                        onClick={handleLogout}
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-4">
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Hire AI talent
                                </NavLink>
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Our AI Work
                                </NavLink>
                                <NavLink
                                    to="/aboutus"
                                    className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Why Choose LLMbeing
                                </NavLink>
                                <NavLink
                                    to="/pricing"
                                    className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </NavLink>
                                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                                    <NavLink
                                        to="/login"
                                        className="hover:text-indigo-500 py-1"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </NavLink>
                                    <NavLink
                                        to="/signup"
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2 inline-block text-center"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Sign up
                                    </NavLink>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;