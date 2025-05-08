// import { NavLink } from "react-router-dom"
// import Dashboard from "../pages/protectedPages/Dashboard"

// const Sidebar = () => {
//     const activeStyle = "  text-blue-500  border-b"
//     return (
//         <div className="flex items-center justify-center text-black  py-5  w-1/6     border border-gray-300 rounded-3xl  px-10  h-1/2 bg-white  fixed left-20 top-30">
//             <div className="flex flex-col    gap-5">
//                 <div>
//                     <p>Welcome Rishu Raj</p>
//                 </div>

//                 <NavLink to="/dashboard"
//                     className={({ isActive }) => (isActive ? activeStyle : "")}
//                 >
//                     Dashboard
//                 </NavLink>

//                 <div className="bg-[#f0f0f2] ">
//                     <NavLink to="/projects"
//                         className=""
//                         activeStyle={activeStyle}>
//                         Projects
//                     </NavLink>
//                     <NavLink>
//                         Saved Projects
//                     </NavLink>
//                     <NavLink>
//                     Continue Project
//                     </NavLink>
//                 </div>



//                 <div>
//                     <NavLink
//                         to="gigs"
//                         activeStyle={activeStyle}>
//                         Gigs
//                     </NavLink>
//                     <NavLink>
//                         Post a gig
//                     </NavLink>
                   
//                 </div>

//                 <NavLink
//                     to="messages"
//                     activeStyle={activeStyle}>
//                     Messages
//                 </NavLink>

//                 <div>
//                     <NavLink
//                         to="profile"
//                         activeStyle={activeStyle}>
//                         Profile
//                     </NavLink>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Sidebar

import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const activeStyle = "bg-gray-400 rounded-lg ";
    const linkClasses = "block py-2 px-4 rounded hover:bg-gray-200 transition-all";

    return (
        <div className="flex flex-col gap-6 h-1/3 ">
            {/* Welcome */}
            <div className="text-center md:text-left">
                <p className="font-semibold">Welcome Rishu Raj</p>
            </div>

            {/* Sidebar sections */}
            <div className="bg-white rounded-xl p-3 border border-gray-300">
                <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Dashboard</NavLink>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-300">
                <NavLink to="/projects" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Browse Projects</NavLink>
                <NavLink to="/saved-projects" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Saved Projects</NavLink>
                <NavLink to="/continue-project" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Continue Project</NavLink>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-300">
                <NavLink to="/gigs" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Your Gigs</NavLink>
                <NavLink to="/post-gig" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Post a Gig</NavLink>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-300">
                <NavLink to="/messages" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Messages</NavLink>
            </div>

            <div className="bg-white rounded-xl p-3 border border-gray-300">
                <NavLink to="/profile" className={({ isActive }) => `${linkClasses} ${isActive ? activeStyle : ""}`}>Profile</NavLink>
            </div>

        </div>
    );
};

export default Sidebar;

