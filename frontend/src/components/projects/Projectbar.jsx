import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, Filter, ChevronUp } from 'lucide-react';
import { useSelector } from 'react-redux';

const Projectbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Simplified tabs - removed unnecessary options
  const getTabs = () => {
    const currentPath = location.pathname;

    // For /projects route (Find Projects page) - no tabs needed, just search/filter
    if (currentPath === '/projects') {
      return [];
    }

    // For /manage-projects route (Manage Projects page)
    if (currentPath.startsWith('/manage-projects')) {
      if (user?.role === 'freelancer') {
        return [
          { to: "/manage-projects/saved", label: "Saved", count: 0 },
          { to: "/manage-projects/applied", label: "Applied", count: 0 },
          { to: "/manage-projects/current", label: "Active", count: 0 },
          { to: "/manage-projects/completed", label: "Completed", count: 0 },
        ];
      } else if (user?.role === 'client') {
        return [
          { to: "/manage-projects/current", label: "Active Projects", count: 0 },
          { to: "/manage-projects/completed", label: "Completed Projects", count: 0 },
          { to: "/manage-projects/applications", label: "Applications", count: 0 },
        ];
      }
    }

    // Default fallback
    return [];
  };

  const tabs = getTabs();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find active tab for mobile display
  const getActiveTab = () => {
    const currentPath = location.pathname;

    // Handle the index route differently for freelancers vs clients
    if (currentPath === '/manage-projects') {
      if (user?.role === 'freelancer') {
        return 'All Projects';
      } else if (user?.role === 'client') {
        return 'Active';
      }
    }

    const activeTab = tabs.find(tab =>
      (tab.to === '/projects' && currentPath === '/projects') ||
      (tab.to !== '/projects' && tab.to !== '/manage-projects' && currentPath.startsWith(tab.to))
    );
    return activeTab ? activeTab.label : tabs[0]?.label || 'Projects';
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/60 p-6">
      {/* Show navigation only if tabs exist */}
      {tabs.length > 0 ? (
        <>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {tabs.map(tab => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.to === "/projects" || (tab.to === "/manage-projects" && user?.role === 'freelancer')}
                  className={({ isActive }) => {
                    // Special case: for clients, highlight "Active" tab when on /manage-projects index
                    const shouldHighlight = isActive ||
                      (location.pathname === '/manage-projects' && user?.role === 'client' && tab.to === '/manage-projects/current');

                    return `px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${shouldHighlight
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200"
                      }`;
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${location.pathname.includes(tab.to.split('/').pop()) ||
                      (location.pathname === '/manage-projects' && user?.role === 'client' && tab.to === '/manage-projects/current')
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-600"
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Enhanced Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 bg-white/90"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white/90"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* For Find Projects page - only search and filter */
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-slate-900">Browse All Projects</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">156 available</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 bg-white/90"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors bg-white/90"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden" ref={dropdownRef}>
        {tabs.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 flex-1 mr-3"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm font-medium">{getActiveTab()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 border border-slate-300 rounded-lg"
              >
                <Search className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
              <div className="mt-3 space-y-1 border border-slate-200 rounded-lg bg-white shadow-lg overflow-hidden">
                {tabs.map(tab => (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    end={tab.to === "/projects"}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                        : "text-slate-600 hover:bg-slate-50"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Mobile view for Find Projects */
          <div className="space-y-3">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-900">Browse Projects</h3>
              <p className="text-sm text-slate-600">156 available projects</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg"
            >
              <Search className="w-4 h-4 text-slate-600" />
              <span>Search & Filter</span>
            </button>
          </div>
        )}

        {/* Mobile Search */}
        {showFilters && (
          <div className="mt-3 p-3 border border-slate-200 rounded-lg bg-slate-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projectbar;