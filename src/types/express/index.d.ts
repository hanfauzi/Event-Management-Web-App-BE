import { CustomJwtPayload } from '../../middlewares/jwt.verify';

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload;
    }
  }
}

export {};