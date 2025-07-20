
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User, Settings, LogOut, Menu, X, MessageCircle, Briefcase, PlusCircle, FileText, Search } from 'lucide-react';
import { logout } from '../../Redux/Slice/authSlice'

const Navbar = ({ isAuthPage }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [isAccountPanelExpanded, setIsAccountPanelExpanded] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notifications] = useState(0); // Mock notification count
    const [searchQuery, setSearchQuery] = useState('');

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Navigation items based on user role
    const getNavigationItems = () => {
        if (!isAuthenticated) return [];

        if (user?.role === 'freelancer') {
            return [
                { path: '/dashboard', label: 'Dashboard', icon: <FileText className="w-4 h-4" /> },
                { path: '/projects', label: 'Find Projects', icon: <Search className="w-4 h-4" /> },
                { path: '/manage-projects', label: 'Manage Projects', icon: <Briefcase className="w-4 h-4" /> },
                { path: '/messages', label: 'Messages', icon: <MessageCircle className="w-4 h-4" /> }
            ];
        } else if (user?.role === 'client') {
            return [
                { path: '/dashboard', label: 'Dashboard', icon: <FileText className="w-4 h-4" /> },
                { path: '/post-project', label: 'Post Project', icon: <PlusCircle className="w-4 h-4" /> },
                { path: '/manage-projects', label: 'Manage Projects', icon: <Briefcase className="w-4 h-4" /> },
                { path: '/messages', label: 'Messages', icon: <MessageCircle className="w-4 h-4" /> }
            ];
        }

        return [];
    };

    const navigationItems = getNavigationItems();

    return (
        <>
            <nav className='fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm'>
                <div className='mx-auto px-6'>
                    <div className='flex items-center justify-between h-16'>
                        {/* Logo */}
                        <div className='flex items-center'>
                            <NavLink to='/' className='flex items-center space-x-2 cursor-pointer'>
                                <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center'>
                                    <span className='text-white font-bold text-sm'>L</span>
                                </div>
                                <span className='font-bold text-xl text-slate-900'>LLMbeing</span>
                            </NavLink>
                        </div>

                        {!isAuthPage && (
                            <>
                                {/* Desktop Navigation - Center section */}
                                <div className='hidden md:flex items-center space-x-1 flex-1 ml-8'>
                                    {isAuthenticated ? (
                                        navigationItems.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                className={({ isActive }) =>
                                                    `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
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
                                                to="/login"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium cursor-pointer"
                                            >
                                                Post AI works
                                            </NavLink>
                                            <NavLink
                                                to="/login"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium cursor-pointer"
                                            >
                                                Find AI Work
                                            </NavLink>
                                            <a
                                                href="#howitworks"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium cursor-pointer"
                                            >
                                                How it Works
                                            </a>
                                            <NavLink
                                                to="/pricing"
                                                className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium cursor-pointer"
                                            >
                                                Pricing
                                            </NavLink>
                                        </>
                                    )}
                                </div>

                                {/* Right side - Search, Notifications, User */}
                                <div className='hidden md:flex items-center space-x-4'>
                                    {isAuthenticated ? (
                                        <>
                                            {/* Search Bar for Freelancers */}
                                            {user?.role === 'freelancer' && (
                                                <form onSubmit={handleSearch} className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Search className="h-4 w-4 text-slate-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        placeholder="Search projects..."
                                                        className="block w-64 pl-10 pr-20 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                    />
                                                    <button
                                                        type="submit"
                                                        className="absolute inset-y-0 right-0 px-3 py-1 m-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                                                    >
                                                        Find
                                                    </button>
                                                </form>
                                            )}

                                            {/* Notifications */}
                                            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
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
                                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
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
                                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                                                                onClick={() => setIsAccountPanelExpanded(false)}
                                                            >
                                                                <User className="w-4 h-4" />
                                                                <span>View Profile</span>
                                                            </NavLink>
                                                            <NavLink
                                                                to="/account-settings"
                                                                className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
                                                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
                                                className='text-slate-600 hover:text-slate-900 font-medium text-sm cursor-pointer'
                                            >
                                                Log in
                                            </NavLink>
                                            <NavLink
                                                to='/signup'
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
                                            >
                                                Sign Up
                                            </NavLink>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile menu button */}
                                <div className='md:hidden ml-auto hamburger'>
                                    <button
                                        onClick={toggleMobileMenu}
                                        className='p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer'
                                    >
                                        {isMobileMenuOpen ? (
                                            <X className="w-6 h-6" />
                                        ) : (
                                            <Menu className="w-6 h-6" />
                                        )}
                                    </button>
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
                                    {/* Mobile Search Bar for Freelancers */}
                                    {user?.role === 'freelancer' && (
                                        <form onSubmit={handleSearch} className="relative mb-4">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search projects..."
                                                className="block w-full pl-10 pr-20 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute inset-y-0 right-0 px-3 py-1 m-1 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                                            >
                                                Find
                                            </button>
                                        </form>
                                    )}

                                    {/* Mobile Navigation Links */}
                                    {navigationItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive
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
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            <span>Profile</span>
                                        </NavLink>
                                        <NavLink
                                            to="/account-settings"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </NavLink>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Post AI work
                                    </NavLink>
                                    <NavLink
                                        to="/login"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Find AI works
                                    </NavLink>
                                    <a
                                        href="#howitworks"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        How it Works
                                    </a>
                                    <NavLink
                                        to="/pricing"
                                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Pricing
                                    </NavLink>
                                    <div className="pt-4 border-t border-slate-200 space-y-2">
                                        <NavLink
                                            to="/login"
                                            className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            Log in
                                        </NavLink>
                                        <NavLink
                                            to="/signup"
                                            className="block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium text-center cursor-pointer"
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