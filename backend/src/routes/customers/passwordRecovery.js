import express from "express";
import passwordRecoveryController from "../../controllers/customers/passwordRecoveryController.js";

const router = express.Router();

router.route("/request-code").post(passwordRecoveryController.requestCode);
router.route("/verify-code").post(passwordRecoveryController.verifyCode);
router.route("/reset-password").post(passwordRecoveryController.resetPassword);

export default router;
