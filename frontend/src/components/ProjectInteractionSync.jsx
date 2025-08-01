import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProjectInteraction } from '../../Redux/Slice/projectSlice';

// This component doesn't render anything visible
// It just watches for lastInteraction changes in the application slice
// and dispatches corresponding actions to the project slice
const ProjectInteractionSync = () => {
    const dispatch = useDispatch();
    const { lastInteraction } = useSelector(state => state.applications);

    useEffect(() => {
        if (lastInteraction) {
            // When we detect a new interaction from the application slice,
            // forward it to the project slice
            dispatch(updateProjectInteraction({
                projectId: lastInteraction.projectId,
                type: lastInteraction.type,
                isActive: true
            }));
        }
    }, [lastInteraction, dispatch]);

    return null; // This component doesn't render anything
};

export default ProjectInteractionSync;
