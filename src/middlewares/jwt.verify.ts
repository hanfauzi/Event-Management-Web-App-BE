import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error";
import { Role } from "../generated/prisma";

export class JwtVerify {
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new ApiError("token must be provided");
      const payload = await jwt.verify(token, process.env.JWT_SECRET_KEY!);
      res.locals.payload = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  static verifyRole(authorizeRole: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { role } = res.locals.payload;

        if (!authorizeRole.includes(role)) {
          throw new ApiError("User role unauthorized access", 401);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }
}
