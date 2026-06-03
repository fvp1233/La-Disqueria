import express from "express";
import customersController from "../../controllers/customers/customerController.js";

const router = express.Router();

router.route("/").get(customersController.getCustomers);
router.route("/:id").put(customersController.deleteCustomer).delete(customersController.deleteCustomer);

export default router