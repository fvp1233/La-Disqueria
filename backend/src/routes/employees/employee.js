import express from 'express'
import employeeController from '../..//controllers/employees/employeeController.js'
import { validateAuthCookie } from '../../middlewares/authMiddleware.js'

const router = express.Router()

router.route("/")
  .get(validateAuthCookie(["admin"]), employeeController.getEmployees)
  .post(validateAuthCookie(["admin"]), employeeController.insertEmployee)

  router.route("/:id")
  .put(validateAuthCookie(["admin"]), employeeController.updateEmployee)
  .delete(validateAuthCookie(["admin"]), employeeController.deleteEmployee)

export default router