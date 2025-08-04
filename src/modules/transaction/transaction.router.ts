import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { JwtVerify } from "../../middlewares/jwt.verify";

export class TransactionRouter {
  private router: Router;
  private transactionController: TransactionController;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/transaction", JwtVerify.verifyToken, 
      this.transactionController.createTransaction
    );
  };

  getRouter = () => {
    return this.router;
  };
}
