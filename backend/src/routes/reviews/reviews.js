import express from "express";
import reviewsController from "../../controllers/reviews/reviewsController.js";
import { validateAuthCookie } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(validateAuthCookie(["customer"]), reviewsController.upsertReview);
router.route("/product/:productId").get(reviewsController.getProductReviews);
router
  .route("/product/:productId/eligibility")
  .get(validateAuthCookie(["customer"]), reviewsController.getEligibility);
router.route("/:id").delete(validateAuthCookie(["customer"]), reviewsController.deleteOwnReview);

export default router;
