import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, Search, Filter, ChevronUp } from 'lucide-react';

const Projectbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const tabs = [
    { to: "/projects", label: "Browse Projects", count: 156 },
    { to: "/projects/saved", label: "Saved", count: 12 },
    { to: "/projects/applied", label: "Applied", count: 8 },
    { to: "/projects/current", label: "Current", count: 3 },
    { to: "/projects/completed", label: "Completed", count: 27 },
  ];

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
    const activeTab = tabs.find(tab =>
      (tab.to === '/projects' && currentPath === '/projects') ||
      (tab.to !== '/projects' && currentPath.startsWith(tab.to))
    );
    return activeTab ? activeTab.label : 'Browse Projects';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-between">
        <div className="flex items-center space-x-1">
          {tabs.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/projects"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`
              }
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

        {/* Search and Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-3 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden" ref={dropdownRef}>
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