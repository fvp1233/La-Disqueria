import express from "express";
import registerCustomerController from "../../controllers/customers/registerCustomerController.js";

const router = express.Router();

router.route("/").post(registerCustomerController.registerCustomer);
router.route("/verifyCodeEmail").post(registerCustomerController.verifyCode);

export default router
