import Gig from "../models/gig.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const addGid = asyncHandler(async (req, res) => {
    const gig = await Gig.create(req.body);
    if (!gig) throw new ApiError(400, "problem in posting gig");
    req.status(200).send(new ApiResponse(200, gig, "successful"));
})

const updateGig = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedGig = await Gig.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!updatedGig) throw new ApiError(400, "gig not found");
    res.status(200).send(new ApiResponse(200, updatedGig, "successfull"))

})

const removeGig = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const removedGig = await Gig.findByIdAndDelete(id);
    if (!removedGig) throw new ApiError(400, "gig not found")
    res.status(200).send(new ApiResponse(200, removedGig, "removed successfull"));
})

const findGig = asyncHandler(async (req, res) => {
    const gigs = Gig.find({});
    if (!gigs) throw new ApiError(400, "unable to find gigs");
    req.status(200).send(new ApiResponse(200, gigs, "successfully finded"));
})

export {addGid,updateGig,removeGig,findGig};