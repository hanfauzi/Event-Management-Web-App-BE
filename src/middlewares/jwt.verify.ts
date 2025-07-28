import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../utils/api.error';

interface CustomJwtPayload {
  id: string;
  email?: string;
  role?: string;
}


export class JwtVerify {
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log(req.headers.authorization);
      if (!token || token === 'null') {
        throw new ApiError('Bearer token is invalid or missing', 401);
      }

      const payload = jwt.verify(token, `${process.env.JWT_SECRET_KEY!}`) as CustomJwtPayload ;

      (req as any).user = {
        id: payload.id,
        email: payload.email,
        role: payload.role
      }
      
      req.body['payload'] = payload;

      next();
    } catch (error) {
      next(error);
    }
  }
}
