import express from "express";
import loginController from "../../controllers/login/loginController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(loginController.loginAdmin);
router.route("/verify").get(validateAuthCookie(["admin"]), loginController.verifySession);

export default router;
