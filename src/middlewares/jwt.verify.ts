import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/api.error';

export class JwtVerify {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log(req.headers.authorization);
      if (!token || token === 'null') {
        throw new ApiError('Bearer token is invalid or missing', 401);
      }

      const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`) as {
        id: string;
        role: "USER" | "ORGANIZER"
      };
      (req as any).user = {
        id: payload.id,
        role: payload.role
      }
      req.body['payload'] = payload;

      next();
    } catch (error) {
      next(error);
    }
  }
}