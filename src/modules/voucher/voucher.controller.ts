import { NextFunction, Request, Response } from "express";
import { VoucherService } from "./voucher.service";
import { CreateVoucherDto } from "./dto/create.voucher.dto";
import { ApiError } from "../../utils/api.error";

export class VoucherController {
  private voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  createVoucher = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = res.locals.payload.userId;
      const body: CreateVoucherDto = req.body;

      const result = await this.voucherService.createVoucher(organizerId, body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  validateVoucher = async (req: Request, res: Response) => {
    const { code, eventId } = req.query;

    console.log({ code, eventId });

    if (!code || !eventId) {
      throw new ApiError("Voucher code and event ID are required", 400);
    }

    const voucher = await this.voucherService.validateVoucher(
      code as string,
      eventId as string
    );
    if (!voucher) {
      throw new ApiError("Voucher not valid or expired", 400);
    }

    res.status(200).json(voucher);
  };

  getInfoVouchers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const organizerId = res.locals.payload.userId;

      console.log("Organizer ID:", organizerId);

      if (!organizerId) {
        throw new ApiError("Organizer ID is required", 400);
      }

      const vouchers = await this.voucherService.getInfoVouchers(organizerId);

      res.status(200).json({ vouchers });
    } catch (error) {
      next(error);
    }
  };

 
}
