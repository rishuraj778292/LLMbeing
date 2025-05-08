import  { Router } from 'express'
import { addGid,updateGig,removeGig,findGig } from '../controllers/gig.controller.js'
import { verifyAccess,verifyData } from '../middleware/gigsValidator.middleware.js'
const router = Router()

router.route("/addgig").post(verifyAccess,verifyData,addGid);
router.route("/update").put(verifyAccess,updateGig);
router.route("/removeGig").delete(verifyAccess,removeGig);
router.route("/findGig").get(findGig);



export default router