import { p } from 'motion/react-client'
import React from 'react'

const ProjectCard = ({project}) => {
  return (
    <div id={project.id} className='border border-gray-300 rounded-2xl p-5 '>
    <div>
      <p>
        {project.title}
      </p>

    </div>

    <div>
      <p>
        {project.budget}
      </p>
    </div>


    <div>
      <p>
        Proposal: 50+
      </p>
    </div>

  <div>
    <p>
      {project.clientName}
    </p>
  </div>

  <div>
        <p>{project.location}</p>
  </div>

  <div>
     <p>{project.description}</p>
  </div>

  <div className='flex gap-3'>
     {project.skillsRequired.map(skill=>
        (
            <p>{skill}</p>
        )
     )}
  </div>
 
 <div>
    <p>
        {project.postedAt}
    </p>
 </div>

  </div>
  )
}

export default ProjectCard