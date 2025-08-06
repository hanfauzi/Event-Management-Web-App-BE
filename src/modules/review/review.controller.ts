import { NextFunction } from "express";
import { ReviewService } from "./review.service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReviewByUser = async (req: any, res: any, next: NextFunction) => {
    try {
      const userId  = res.locals.payload.userId;
      console.log("User ID:===>>>", userId); // Debugging line to check userId

      const {eventId}  = req.params;
      console.log("Event ID:===>>>", eventId); // Debugging line to check eventId

      const { rating, comment } = req.body;

      const result = await this.reviewService.createReviewByUser(
        userId,
        eventId,
        rating,
        comment
      );
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
