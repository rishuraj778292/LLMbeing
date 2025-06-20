import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '../../../../Redux/Slice/projectSlice';
import ProjectCard from '../../../components/projects/ProjectCard'
import FilterSidebar from '../../../components/projects/FilterSidebar';

const BrowseProjects = () => {
  const dispatch = useDispatch();
  const { projects, page, totalPages, status, loadingMore } = useSelector((state) => state.projects);
  const observer = useRef();

  const lastProjectRef = useCallback(
    (node) => {
      if (loadingMore || status === 'loading' || page >= totalPages) return;

      // Disconnect the previous observer if it exists
      if (observer.current) observer.current.disconnect();

      // Create a new observer for the last project
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          // Dispatch fetchProjects with the next page
          dispatch(fetchProjects({ page: page + 1, limit: 10, filters: { projectType: 'hourly' } }));
        }
      });

      // Start observing the last node (last project)
      if (node) observer.current.observe(node);
    },
    [dispatch, page, totalPages, loadingMore, status]
  );

  useEffect(() => {
    // Initial data fetch for projects
    dispatch(fetchProjects({ page: 1, limit: 10, filters: { projectType: 'hourly' } }));
  }, [dispatch]);

  return (


    <div className='flex flex-row gap-19 pt-10'>
      <div className='w-full flex flex-col gap-5'>
        {status === 'loading' && <p>Loading initial projects...</p>}

        {projects.map((project, idx) => (
          <ProjectCard
          project = {project}
          ref={idx === projects.length - 1 ? lastProjectRef : null} // Assign lastProjectRef to the last item
          />
          // <div
          //   ref={idx === projects.length - 1 ? lastProjectRef : null} // Assign lastProjectRef to the last item
          //   key={project._id}
          //   className='p-5  border border-gray-300'
          // >
          //   <h3>{project.title}</h3>
          //   <p>{project.description}</p>
          // </div>
        ))}

        {loadingMore && <p>Loading more projects...</p>} {/* Show loading state when fetching more */}
      </div>
       <FilterSidebar/>
    </div>

  )
}

export default BrowseProjects
