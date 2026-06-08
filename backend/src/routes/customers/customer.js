import express from "express";
import customersController from "../../controllers/customers/customerController.js";

const router = express.Router();

router.route("/").get(customersController.getCustomers).post(customersController.createCustomer);
router.route("/:id").put(customersController.updateCustomers).delete(customersController.deleteCustomer);

export default router