import { Router } from "express";
import { JwtVerify } from "../../middlewares/jwt.verify";
import { VoucherController } from "./voucher.controller";

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;
  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/create-voucher",
      JwtVerify.verifyToken,
      this.voucherController.createVoucher
    );
    this.router.get(
      "/voucher/validate",
      this.voucherController.validateVoucher
    );
    this.router.get(
      "/vouchers",
      JwtVerify.verifyToken,
      this.voucherController.getInfoVouchers
    );
  };

  getRouter = () => {
    return this.router;
  };
}
