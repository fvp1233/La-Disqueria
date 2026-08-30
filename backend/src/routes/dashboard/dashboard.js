import express from "express";
import dashboardController from "../../controllers/dashboard/dashboardController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(validateAuthCookie(["admin"]), dashboardController.getDashboardStats);

export default router;
