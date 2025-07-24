import { Request, Response, NextFunction } from 'express';
import { ApiError }from '../../utils/api.error';


export class SampleController {
  async getSampleData(req: Request, res: Response, next: NextFunction) {
    try {
      const { sample } = req.body;

      /*
         📒Docs:
         Using `AppError Class` for Error Handle Exception
      */
      if (!sample) throw new ApiError('Sample data is not found', 404);

      res.status(200).json({
        success: true,
        message: 'Get data successfull',
        samples: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
