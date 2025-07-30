import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api.error';

export class JwtVerify {
  static verifyOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token || token === 'null') {
        throw new ApiError('Bearer token is invalid or missing', 401);
      }

      const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`) as {
        id: string;
        role: "ORGANIZER"
      };

      if (payload.role !== "ORGANIZER") {
        throw new ApiError("Unauthorized - Organizer only access", 403);
      }

      (req as any).organizer = {
        id: payload.id,
      };

      next();
    } catch (error) {
      next(error);
    }
  }
}
