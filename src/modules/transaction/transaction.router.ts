import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { JwtVerify } from "../../middlewares/jwt.verify";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;
  private uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/transaction",
      JwtVerify.verifyToken,
      this.transactionController.createTransaction
    );

    this.router.post(
      "/transaction/:id/payment",
      JwtVerify.verifyToken,
      this.uploaderMiddleware.upload().single("paymentProof"),
      this.transactionController.uploadPaymentProof
    );

    this.router.get(
      "/transaction/:id",
      JwtVerify.verifyToken,
      this.transactionController.getTransactionById
    );

    this.router.get(
      "/transactions/:id/payment-proof",
      JwtVerify.verifyToken,
      this.transactionController.getPaymentProof
    );

    this.router.patch(
      "/transactions/:id/accept",
      JwtVerify.verifyToken,
      this.transactionController.acceptTransaction
    );

    this.router.patch(
      "/transactions/:id/reject",
      JwtVerify.verifyToken,
      this.transactionController.rejectTransaction
    );
  };

  getRouter = () => {
    return this.router;
  };
}
