import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReviewByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.payload.userId;

      const { eventId } = req.params;

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

  getOrganizerReviews = async (req: Request, res: Response) => {
    const { organizerId } = req.params;

    try {
      const data =
        await this.reviewService.getOrganizerReviewsService(organizerId);

       res.status(200).json({data});
    } catch (error) {
       res.status(500).json(error);
    }
  };
}
