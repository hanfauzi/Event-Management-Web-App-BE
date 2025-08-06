import { ApiError } from "../../utils/api.error";
import prisma from "../prisma/prisma.service";

export class ReviewService {
  createReviewByUser = async (
    userId: string,
    eventId: string,
    rating: number,
    comment: string
  ) => {
    // 1. Cek apakah user pernah hadir di event tersebut
    const userHasAttended = await prisma.transaction.findFirst({
      where: { userId, eventId, status: "DONE" },
    });

    if (!userHasAttended) {
      throw new ApiError("User has not attended this event", 400);
    }

    // 2. Cek apakah user sudah pernah memberikan review untuk event ini
    const hasReviewed = await prisma.review.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (hasReviewed) {
      throw new ApiError("You already reviewed this event.", 400);
    }

    // 3. Buat review
    const newReview = await prisma.review.create({
      data: {
        userId,
        eventId,
        rating,
        comment,
      },
    });

    return {
      message: "Review created successfully",
      data: newReview,
    };
  };
}
