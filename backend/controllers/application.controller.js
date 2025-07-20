import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// apply project
const apply = asyncHandler((req, res) => {
        if (req.user.role !== 'freelancer') {
                throw new ApiError(403, "Only freelancers can apply to projects");
        }

        const { rpoposedBudget, expectsDelivery, coverLetter, resume } = req.body;
        const project_id = req.params;
        const apllicant_id = req.user.id;

        if (!project_id) throw new ApiError(400, "Invalid project Id");
})


// edit applied project


//withdraw


// by client
// accept  proposal

// reject proposal