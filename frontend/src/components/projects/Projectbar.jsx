import React from 'react'
import { NavLink } from 'react-router-dom'
const Projectbar = () => {
    return (
        <div className='flex  w-full justify-between px-10 py-2 border border-gray-300  rounded-md'>
            <NavLink>
                Browse Projects
            </NavLink>
            <NavLink>
                Saved Projects
            </NavLink>
            <NavLink>
                Applied Project
            </NavLink>
            <NavLink>
                Active Projects
            </NavLink>
            <NavLink>
                Completed Projects
            </NavLink>
        </div>
    )
}

export default Projectbar