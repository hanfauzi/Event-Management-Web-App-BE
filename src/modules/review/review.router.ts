import { Router } from "express";
import { JwtVerify } from "../../middlewares/jwt.verify";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { ReviewController } from "./review.controller";

export class ReviewRouter {
  private router: Router;
    private reviewController: ReviewController;
  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/review/:eventId",
      JwtVerify.verifyToken,
      this.reviewController.createReviewByUser
    );
  };

  getRouter = () => {
    return this.router;
  };
}
