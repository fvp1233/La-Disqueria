import express from "express";
import customersController from "../../controllers/customers/customerController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// El POST no se protege: un customer puede registrarse a sí mismo
router.route("/").get(validateAuthCookie(["admin"]), customersController.getCustomers).post(customersController.createCustomer);
router.route("/:id").put(validateAuthCookie(["admin"]), customersController.updateCustomers).delete(validateAuthCookie(["admin"]), customersController.deleteCustomer);

export default router