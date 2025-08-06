import { NextFunction, Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { ApiError } from "../../utils/api.error";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

export class TransactionController {
  private transactionService: TransactionService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.transactionService = new TransactionService();
    this.cloudinaryService = new CloudinaryService();
  }

  createTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = res.locals.payload;
      const body = { ...req.body, userId };
      const transaction = await this.transactionService.createTransaction(body);
      res.status(201).json({
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  };

  uploadPaymentProof = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = req.params.id;

      console.log(transactionId);
      const file = req.file;

      console.log(file);
      if (!file) {
        throw new ApiError("Payment proof is required", 400);
      }

      const uploaded = await this.cloudinaryService.upload(
        file,
        "payment-proofs"
      );

      const updated = await this.transactionService.uploadPaymentProof(
        transactionId,
        uploaded.secure_url
      );

      res.status(200).json({
        message: "Payment proof uploaded successfully",
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };

  getTransactionsUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = res.locals.payload.userId;
      const transaction = await this.transactionService.getTransactionsUserById( userId);

      res.status(200).json({
        message: "Transaction fetched successfully",
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  };

  getPaymentProof = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const proof =
        await this.transactionService.getPaymentProof(id);

      res.status(200).json({
        message: "Payment proof fetched successfully",
        data: proof,
      });
    } catch (err) {
      next(err);
    }
  };

  acceptTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedTransaction =
        await this.transactionService.acceptTransaction(id);

      res.status(200).json({
        message: "Transaction accepted successfully",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  rejectTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedTransaction =
        await this.transactionService.rejectTransaction(id);
      res.status(200).json({
        message: "Transaction rejected successfully",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  getPendingTransactionsByOrganizer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Assuming organizerId is stored in JWT and set to res.locals.payload.organizerId
      const organizerId  = res.locals.payload.userId;
      if (!organizerId) {
       res.status(403).json({ message: "Forbidden: Not an organizer" });
      }
      const transactions = await this.transactionService.getPendingTransactionsByOrganizer(organizerId);
      res.status(200).json({
        message: "Pending transactions fetched successfully",
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  };
}
