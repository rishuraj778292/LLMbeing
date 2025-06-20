import React from 'react'
import Projectbar from '../../../components/projects/Projectbar'
import { Outlet } from 'react-router-dom'
const ProjectsLayout = () => {
  return (
    <div>
       <Projectbar/>
        <div>
             <Outlet/>
        </div>
    </div>
  )
}

export default ProjectsLayout