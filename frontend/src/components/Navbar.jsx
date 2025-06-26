// // import React, { useState } from 'react';
// // import { useSelector,useDispatch } from 'react-redux';
// // import { assets } from '../assets/assets';
// // import {logout} from '../../Redux/Slice/authSlice'
// // import { NavLink } from 'react-router-dom';

// // const Navbar = ({ isAuthPage }) => {
// //     const dispatch = useDispatch();
// //     const activeClassName = "bg-indigo-600 px-5 py-2"
// //     const { user, isAuthenticated } = useSelector((state) => state.auth);
// //     console.log("Navbar user:", user);
// //     const [isAccountPannelExpanded, setisAccountPannelExpanded] = useState(false)
// //     const handleAccountPannel = () => {
// //         if (isAccountPannelExpanded === true) {
// //             setisAccountPannelExpanded(false);
// //         }
// //         else {
// //             setisAccountPannelExpanded(true);
// //         }
// //     }
// //     return (
// //         <div className='fixed top-0 left-0 right-0 z-50   bg-white flex items-center  py-2 px-5'>
// //             <div className='cursor-pointer '>
// //                 <a href='/' className='font-bold text-xl '>
// //                     LLMbeing
// //                 </a>
// //             </div>

// //             {!isAuthPage &&
// //                 (isAuthenticated ? (
// //                     // free lancer  navbar
// //                     (user.role === "freelancer" ? (
// //                         <div className="flex   items-center  justify-between">
// //                             <div>
// //                                 <NavLink>Dashboard</NavLink>
// //                                 <NavLink>Projects</NavLink>
// //                                 <NavLink>Your gigs</NavLink>
// //                                 <NavLink>Message</NavLink>
// //                             </div>

// //                             <div className="flex  items-center  gap-10  relative">
// //                                 <img src={assets.notification} alt="" className="w-5 h-5" />
// //                                 <div className="flex justify-center items-center gap-1" onClick={handleAccountPannel}>
// //                                     <img src={assets.user_icon} alt="" className="w-7 h-7" />
// //                                     <p>{user.userName}</p>
// //                                     {isAccountPannelExpanded ?
// //                                         <img src={assets.up_arrow} alt="" className="w-5 h-5" />
// //                                         :
// //                                         <img src={assets.down_arrow} alt="" className="w-5 h-5" />}
// //                                 </div>
// //                                 {isAccountPannelExpanded &&
// //                                     <div className='absolute top-10  right-0   flex flex-col justify-center  gap-3 bg-white border border-gray-400 rounded-2xl p-5 w-50 '>
// //                                         <div>Account</div>
// //                                         <div className='flex flex-col justify-center pl-5 gap-3'>
// //                                             <NavLink to="/profile" className='hover:text-indigo-500' onClick={handleAccountPannel}>Profile</NavLink>
// //                                             <NavLink to="/account-setting" className='hover:text-indigo-500'>setting</NavLink>
// //                                             <NavLink className='hover:text-indigo-500' onClick={()=>dispatch(logout())}>Log out</NavLink>
// //                                         </div>
// //                                     </div>

// //                                 }

// //                             </div>
// //                         </div>
// //                     ) :

// //                         // client navbar
// //                         user.role === "client" ? (
// //                             <div className="flex justify-between  items-center ">

// //                                 <div className="flex  items-center  gap-10  relative">
// //                                     <img src={assets.notification} alt="" className="w-5 h-5" />
// //                                     <div className="flex justify-center items-center gap-1" onClick={handleAccountPannel}>
// //                                         <img src={assets.user_icon} alt="" className="w-7 h-7" />
// //                                         {isAccountPannelExpanded ?
// //                                             <img src={assets.up_arrow} alt="" className="w-5 h-5" />
// //                                             :
// //                                             <img src={assets.down_arrow} alt="" className="w-5 h-5" />}
// //                                     </div>
// //                                     {isAccountPannelExpanded &&
// //                                         <div className='absolute top-10  right-1.2   flex flex-col justify-center items-center gap-3 bg-white border-2 rounded-2xl p-5 '>
// //                                             <NavLink to="/account-setting" className='' onClick={handleAccountPannel}>My account</NavLink>
// //                                             <button onClick={dispatch(logout)}>Log out</button>
// //                                         </div>

// //                                     }

// //                                 </div>
// //                             </div>
// //                         ) :


// //                             // admin navbar
// //                             (
// //                                 <div className="flex justify-between  items-center ">

// //                                     <div className="flex  items-center  gap-10 ">
// //                                         <img src={assets.notification} alt="" className="w-5 h-5" />
// //                                         <div className="flex justify-center items-center gap-1">
// //                                             <img src={assets.user_icon} alt="" className="w-7 h-7" />
// //                                             <img src={assets.down_arrow} alt="" className="w-5 h-5" />
// //                                         </div>

// //                                     </div>
// //                                 </div>
// //                             ))

// //                 ) : (
// //                     <div className='flex justify-between items-center w-[100%] text-md pl-5'>
// //                         <div className='flex gap-5 items-center text-md'>

// //                             <NavLink to="/login">Hire AI talent</NavLink>
// //                             <NavLink to="/login">Our AI Work</NavLink>
// //                             <NavLink to='/aboutus'>Why  Choose  LLMbeing</NavLink>
// //                             <NavLink>Pricing</NavLink>



// //                         </div>
// //                         <div className=' flex gap-5 justify-center items-center'>
// //                             <a href='/login' className='cursor-pointer'>
// //                                 Log in
// //                             </a>
// //                             <a
// //                                 href='/signup'
// //                                 className='cursor-pointer px-5 bg-indigo-500  hover:bg-indigo-600 rounded-md py-2'
// //                             >
// //                                 Sign up
// //                             </a>
// //                         </div>
// //                     </div>
// //                 ))}
// //         </div>
// //     );
// // };

// // export default Navbar;


// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { assets } from '../assets/assets';
// import { logout } from '../../Redux/Slice/authSlice';
// import { NavLink } from 'react-router-dom';

// const Navbar = ({ isAuthPage }) => {
//     const dispatch = useDispatch();
//     const activeClassName = "bg-indigo-600 text-white px-5 py-2 rounded";
//     const { user, isAuthenticated } = useSelector((state) => state.auth);
//     console.log(user)
//     const [isAccountPanelExpanded, setIsAccountPanelExpanded] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//     // Close panels when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (isAccountPanelExpanded && !event.target.closest('.account-panel-container')) {
//                 setIsAccountPanelExpanded(false);
//             }
//             if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container') &&
//                 !event.target.closest('.hamburger')) {
//                 setIsMobileMenuOpen(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, [isAccountPanelExpanded, isMobileMenuOpen]);

//     const handleAccountPanel = () => {
//         setIsAccountPanelExpanded(!isAccountPanelExpanded);
//     };

//     const toggleMobileMenu = () => {
//         setIsMobileMenuOpen(!isMobileMenuOpen);
//     };

//     const handleLogout = () => {
//         dispatch(logout());
//         setIsAccountPanelExpanded(false);
//         setIsMobileMenuOpen(false);
//     };

//     return (
//         <div className='fixed top-0 left-0 right-0 z-50 bg-white '>
//             <div className='container mx-auto flex items-center justify-between py-3 px-4 md:px-6'>
//                 {/* Logo */}
//                 <div className='cursor-pointer'>
//                     <a href='/' className='font-bold text-xl'>
//                         LLMbeing
//                     </a>
//                 </div>

//                 {/* Hamburger menu for mobile */}
//                 {!isAuthPage && (
//                     <div className='md:hidden hamburger'>
//                         <button onClick={toggleMobileMenu} className='p-2'>
//                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//                             </svg>
//                         </button>
//                     </div>
//                 )}

//                 {/* Desktop Navigation */}
//                 {!isAuthPage && (
//                     <div className='hidden md:block w-full pl-5'>
//                         {isAuthenticated ? (
//                             <div className="flex items-center justify-between w-full">
//                                 {/* Freelancer Navigation Links */}
//                                 {user?.role === "freelancer" && (
//                                     <div className="flex items-center space-x-6">
//                                         <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
//                                         <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Projects</NavLink>
//                                         <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Your gigs</NavLink>
//                                         <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
//                                     </div>
//                                 )}
//                                 {user?.role === "client" && (
//                                     <div className="flex items-center space-x-6">
//                                         <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
//                                         <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Your Projects</NavLink>
//                                         <NavLink to="/post-project" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Post Projects</NavLink>
//                                         <NavLink to="/post-project" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Applications</NavLink>
//                                         <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>gigs</NavLink>
//                                         <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
//                                     </div>
//                                 )}
//                                 {user?.role === "admin" && (
//                                     <div className="flex items-center space-x-6">
//                                         <NavLink to="/dashboard" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Dashboard</NavLink>
//                                         <NavLink to="/projects" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Projects</NavLink>
//                                         <NavLink to="/gigs" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>gigs</NavLink>
//                                         <NavLink to="/messages" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>Message</NavLink>
//                                     </div>
//                                 )}

//                                 {/* User Controls - Notification and Account */}
//                                 <div className="flex items-center gap-6 ml-auto account-panel-container">
//                                     <button className="relative">
//                                         <img src={assets.notification} alt="Notifications" className="w-5 h-5" />
//                                     </button>
//                                     <div className="flex items-center gap-2 cursor-pointer" onClick={handleAccountPanel}>
//                                         <img src={user.profileImage === ""
//                                             ? assets.user_icon : user.profileImage
//                                         } alt="User" className="w-7 h-7" />
//                                         {user?.userName && <p className="hidden sm:block">{user.userName}</p>}
//                                         <img
//                                             src={isAccountPanelExpanded ? assets.up_arrow : assets.down_arrow}
//                                             alt="Toggle account menu"
//                                             className="w-4 h-4"
//                                         />
//                                     </div>

//                                     {/* Account Panel Dropdown */}
//                                     {isAccountPanelExpanded && (
//                                         <div className='absolute top-14 right-4 flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48 z-50'>
//                                             <h3 className="font-medium mb-2">Account</h3>
//                                             <div className='flex flex-col space-y-2'>
//                                                 <NavLink
//                                                     to="/profile"
//                                                     className='hover:text-indigo-500 py-1'
//                                                     onClick={() => setIsAccountPanelExpanded(false)}
//                                                 >
//                                                     Profile
//                                                 </NavLink>
//                                                 <NavLink
//                                                     to="/account-setting"
//                                                     className='hover:text-indigo-500 py-1'
//                                                     onClick={() => setIsAccountPanelExpanded(false)}
//                                                 >
//                                                     Settings
//                                                 </NavLink>
//                                                 <button
//                                                     className='text-left hover:text-indigo-500 py-1'
//                                                     onClick={handleLogout}
//                                                 >
//                                                     Log out
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className='flex justify-between items-center w-full'>
//                                 <div className='flex gap-6 items-center'>
//                                     <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
//                                         Hire AI talent
//                                     </NavLink>
//                                     <NavLink to="/login" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
//                                         Our AI Work
//                                     </NavLink>
//                                     <NavLink to='/about-us' className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
//                                         Why Choose LLMbeing
//                                     </NavLink>
//                                     <NavLink to="/pricing" className={({ isActive }) => isActive ? activeClassName : "hover:text-indigo-600"}>
//                                         Pricing
//                                     </NavLink>
//                                 </div>

//                                 <div className='flex gap-4 items-center'>
//                                     <NavLink to='/login' className='hover:text-indigo-600'>
//                                         Log in
//                                     </NavLink>
//                                     <NavLink
//                                         to='/signup'
//                                         className="group relative bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white  px-7 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden"
//                                     >
//                                         <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                                         <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
//                                         <span className="relative z-10 flex items-center justify-center gap-2">
//                                             Sign Up

//                                         </span>
//                                     </NavLink>





//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>

//             {/* Mobile Navigation Menu */}
//             {!isAuthPage && isMobileMenuOpen && (
//                 <div className="md:hidden mobile-menu-container">
//                     <div className="bg-white border-t border-gray-200 py-3 px-4 shadow-lg">
//                         {isAuthenticated ? (
//                             <div className="flex flex-col space-y-4">
//                                 {/* Freelancer Navigation Links */}
//                                 {user?.role === "freelancer" && (
//                                     <>
//                                         <NavLink
//                                             to="/dashboard"
//                                             className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             Dashboard
//                                         </NavLink>
//                                         <NavLink
//                                             to="/projects"
//                                             className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             Projects
//                                         </NavLink>
//                                         <NavLink
//                                             to="/gigs"
//                                             className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             Your gigs
//                                         </NavLink>
//                                         <NavLink
//                                             to="/messages"
//                                             className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             Message
//                                         </NavLink>
//                                     </>
//                                 )}

//                                 {/* User Account Links */}
//                                 <div className="pt-2 border-t border-gray-200">
//                                     <h3 className="font-medium mb-2">Account</h3>
//                                     <NavLink
//                                         to="/profile"
//                                         className="block py-1"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         Profile
//                                     </NavLink>
//                                     <NavLink
//                                         to="/account-setting"
//                                         className="block py-1"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         Settings
//                                     </NavLink>
//                                     <button
//                                         className="block py-1 text-left w-full"
//                                         onClick={handleLogout}
//                                     >
//                                         Log out
//                                     </button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col space-y-4">
//                                 <NavLink
//                                     to="/login"
//                                     className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                 >
//                                     Hire AI talent
//                                 </NavLink>
//                                 <NavLink
//                                     to="/login"
//                                     className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                 >
//                                     Our AI Work
//                                 </NavLink>
//                                 <NavLink
//                                     to="/aboutus"
//                                     className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                 >
//                                     Why Choose LLMbeing
//                                 </NavLink>
//                                 <NavLink
//                                     to="/pricing"
//                                     className={({ isActive }) => isActive ? "text-indigo-600 font-medium" : ""}
//                                     onClick={() => setIsMobileMenuOpen(false)}
//                                 >
//                                     Pricing
//                                 </NavLink>
//                                 <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
//                                     <NavLink
//                                         to="/login"
//                                         className="hover:text-indigo-500 py-1"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         Log in
//                                     </NavLink>
//                                     <NavLink
//                                         to="/signup"
//                                         className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-2 inline-block text-center"
//                                         onClick={() => setIsMobileMenuOpen(false)}
//                                     >
//                                         Sign up
//                                     </NavLink>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, Menu, X, MessageCircle, Briefcase, PlusCircle, FileText, Search } from 'lucide-react';
import {logout} from '../../Redux/Slice/authSlice'

const Navbar = ({ isAuthPage }) => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isAccountPanelExpanded, setIsAccountPanelExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState(3); // Mock notification count

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

    // Navigation items based on user role
    const getNavigationItems = () => {
        if (!isAuthenticated) return [];
        
        const baseItems = [
            { path: '/dashboard', label: 'Dashboard', icon: <FileText className="w-4 h-4" /> },
            { path: '/messages', label: 'Messages', icon: <MessageCircle className="w-4 h-4" /> }
        ];

        if (user?.role === 'freelancer') {
            return [
                ...baseItems,
                { path: '/projects', label: 'Projects', icon: <Briefcase className="w-4 h-4" /> },
                { path: '/gigs', label: 'My Gigs', icon: <FileText className="w-4 h-4" /> }
            ];
        } else if (user?.role === 'client') {
            return [
                ...baseItems,
                { path: '/projects', label: 'My Projects', icon: <Briefcase className="w-4 h-4" /> },
                { path: '/post-project', label: 'Post Project', icon: <PlusCircle className="w-4 h-4" /> },
                { path: '/find-talent', label: 'Find Talent', icon: <Search className="w-4 h-4" /> }
            ];
        }
        
        return baseItems;
    };

    const navigationItems = getNavigationItems();

    return (
        <>
            <nav className='fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm'>
                <div className=' mx-auto px-10'>
                    <div className='flex justify-between items-center h-16'>
                        {/* Logo */}
                        <div className='flex items-center'>
                            <NavLink to='/' className='flex items-center space-x-2'>
                                <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center'>
                                    <span className='text-white font-bold text-sm'>L</span>
                                </div>
                                <span className='font-bold text-xl text-slate-900'>LLMbeing</span>
                            </NavLink>
                        </div>

                        {!isAuthPage && (
                            <>
                                {/* Desktop Navigation */}
                                <div className='hidden md:flex items-center space-x-1'>
                                    {isAuthenticated ? (
                                        navigationItems.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                        isActive
                                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                    }`
                                                }
                                            >
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))
                                    ) : (
                                        <>
                                            <NavLink
                                                to="/browse-talent"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
                                            >
                                                Find Talent
                                            </NavLink>
                                            <NavLink
                                                to="/how-it-works"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
                                            >
                                                How it Works
                                            </NavLink>
                                            <NavLink
                                                to="/pricing"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium"
                                            >
                                                Pricing
                                            </NavLink>
                                        </>
                                    )}
                                </div>

                                {/* Right side - User controls or Auth buttons */}
                                <div className='flex items-center space-x-4'>
                                    {isAuthenticated ? (
                                        <>
                                            {/* Notifications */}
                                            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">
                                                <Bell className="w-5 h-5" />
                                                {notifications > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                                        {notifications > 9 ? '9+' : notifications}
                                                    </span>
                                                )}
                                            </button>

                                            {/* User Account Dropdown */}
                                            <div className="relative account-panel-container">
                                                <button
                                                    onClick={handleAccountPanel}
                                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                                        {user?.profileImage ? (
                                                            <img 
                                                                src={user.profileImage} 
                                                                alt="Profile" 
                                                                className="w-8 h-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="text-white text-sm font-medium">
                                                                {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="hidden sm:block text-left">
                                                        <p className="text-sm font-medium text-slate-900">
                                                            {user?.userName || 'User'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 capitalize">
                                                            {user?.role || 'Member'}
                                                        </p>
                                                    </div>
                                                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isAccountPanelExpanded ? 'rotate-180' : ''}`} />
                                                </button>

                                                {/* Account Dropdown Menu */}
                                                {isAccountPanelExpanded && (
                                                    <div className='absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50'>
                                                        {/* User Info Header */}
                                                        <div className="px-4 py-3 border-b border-slate-100">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                                                                    {user?.profileImage ? (
                                                                        <img 
                                                                            src={user.profileImage} 
                                                                            alt="Profile" 
                                                                            className="w-10 h-10 rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-white font-medium">
                                                                            {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-slate-900">
                                                                        {user?.userName || 'User'}
                                                                    </p>
                                                                    <p className="text-sm text-slate-500 capitalize">
                                                                        {user?.role || 'Member'}
                                                                    </p>
                                                                    {user?.email && (
                                                                        <p className="text-xs text-slate-400 truncate max-w-40">
                                                                            {user.email}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Menu Items */}
                                                        <div className="py-2">
                                                            <NavLink
                                                                to="/profile"
                                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                                onClick={() => setIsAccountPanelExpanded(false)}
                                                            >
                                                                <User className="w-4 h-4" />
                                                                <span>View Profile</span>
                                                            </NavLink>
                                                            <NavLink
                                                                to="/account-settings"
                                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                                                onClick={() => setIsAccountPanelExpanded(false)}
                                                            >
                                                                <Settings className="w-4 h-4" />
                                                                <span>Account Settings</span>
                                                            </NavLink>
                                                        </div>

                                                        {/* Logout */}
                                                        <div className="border-t border-slate-100 pt-2">
                                                            <button
                                                                onClick={handleLogout}
                                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                                <span>Sign Out</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className='flex items-center space-x-3'>
                                            <NavLink
                                                to='/login'
                                                className='text-slate-600 hover:text-slate-900 font-medium text-sm'
                                            >
                                                Log in
                                            </NavLink>
                                            <NavLink
                                                to='/signup'
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                Sign Up
                                            </NavLink>
                                        </div>
                                    )}

                                    {/* Mobile menu button */}
                                    <div className='md:hidden hamburger'>
                                        <button
                                            onClick={toggleMobileMenu}
                                            className='p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors'
                                        >
                                            {isMobileMenuOpen ? (
                                                <X className="w-6 h-6" />
                                            ) : (
                                                <Menu className="w-6 h-6" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {!isAuthPage && isMobileMenuOpen && (
                    <div className="md:hidden mobile-menu-container border-t border-slate-200 bg-white">
                        <div className="px-4 py-4 space-y-3">
                            {isAuthenticated ? (
                                <>
                                    {/* Mobile Navigation Links */}
                                    {navigationItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                                }`
                                            }
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </NavLink>
                                    ))}

                                    {/* Mobile Account Section */}
                                    <div className="pt-4 border-t border-slate-200 space-y-2">
                                        <NavLink
                                            to="/profile"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </NavLink>
                                        <NavLink
                                            to="/account-settings"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/browse-talent"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Find Talent
                                    </NavLink>
                                    <NavLink
                                        to="/how-it-works"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        How it Works
                                    </NavLink>
                                    <NavLink
                                        to="/pricing"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pricing
                                    </NavLink>
                                    <div className="pt-4 border-t border-slate-200 space-y-2">
                                        <NavLink
                                            to="/login"
                                            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </NavLink>
                                        <NavLink
                                            to="/signup"
                                            className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Sign Up
                                        </NavLink>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
            
            {/* Spacer to prevent content from being hidden behind fixed navbar */}
            <div className="h-16"></div>
        </>
    );
};

export default Navbar;