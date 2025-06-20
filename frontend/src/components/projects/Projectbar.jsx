// import React from 'react'
// import { NavLink } from 'react-router-dom'
// const Projectbar = () => {
//     const tabs = [
//         { to: "/projects", label: "Browse" },
//         { to: "/projects/saved", label: "Saved" },
//         { to: "/projects/applied", label: "Applied" },
//         { to: "/projects/current", label: "Current" },
//         { to: "/projects/completed", label: "Completed" },
//     ];
//     return (
//         <div className='flex  w-full justify-between px-10 py-2 border border-gray-300  rounded-md'>
//             {tabs.map(tab => (
//                 <NavLink
//                     key={tab.to}
//                     to={tab.to}
//                     end={tab.to === "/projects"}
//                     className={({ isActive }) =>
//                         isActive ? "text-blue-600 font-semibold" : "text-gray-600"
//                     }
//                 >
//                     {tab.label}
//                 </NavLink>
//             ))}
//         </div>
//     )
// }

// export default Projectbar

import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Projectbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const tabs = [
    { to: "/projects", label: "Browse" },
    { to: "/projects/saved", label: "Saved" },
    { to: "/projects/applied", label: "Applied" },
    { to: "/projects/current", label: "Current" },
    { to: "/projects/completed", label: "Completed" },
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
    const currentPath = window.location.pathname;
    const activeTab = tabs.find(tab => 
      (tab.to === '/projects' && currentPath === '/projects') || 
      (tab.to !== '/projects' && currentPath.startsWith(tab.to))
    );
    return activeTab ? activeTab.label : 'Browse';
  };

  return (
    <div className="w-full">
      {/* Desktop Navigation - Same as original with enhanced styling */}
      <div className="hidden md:flex w-full justify-between px-10 py-3 border border-gray-300 rounded-md bg-white shadow-sm">
        {tabs.map(tab => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/projects"}
            className={({ isActive }) =>
              isActive 
                ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1 transition-all" 
                : "text-gray-600 hover:text-indigo-500 transition-all"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden w-full" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700"
        >
          <span className={isOpen ? "text-indigo-600 font-medium" : "text-gray-700"}>
            {getActiveTab()}
          </span>
          {isOpen ? 
            <ChevronUp className="h-5 w-5 text-indigo-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg py-1">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/projects"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2 text-sm ${
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 font-medium" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projectbar;