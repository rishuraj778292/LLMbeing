import {asyncHandler} from '../utils/asyncHandler'

const register = asyncHandler(async (req,res)=>{
        res.status(200).json({
            messsage:"ok"
        })
})

export {register}