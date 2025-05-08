import { Router } from "express";
import { register,login ,verifyUser,refreshtoken,logoutUser} from "../controllers/auth.controller.js";
import { registerValidator } from "../middleware/authValidator.middleware.js";
import verifyToken from "../middleware/verifyToken.middleware.js";
const router = Router();

router.route("/register").post(registerValidator ,register);
router.route("/login").post(login);
router.route("/verifyUser").get(verifyToken,verifyUser);
router.route("/refreshtoken").get(refreshtoken);
router.route("/logout").get(logoutUser)



export default router;