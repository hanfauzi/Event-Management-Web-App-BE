import prisma from "../prisma/prisma.service";
import { TransactionStatus } from "../../generated/prisma";
import { CreateTransactionDTO } from "./dto/create.transaction.dto";
import { ApiError } from "../../utils/api.error";
import { TransactionMailer } from "../mailer/mailer.service";

export class TransactionService {
  createTransaction = async (body: CreateTransactionDTO) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Cek apakah event ada
      const event = await tx.event.findUnique({
        where: { id: body.eventId },
      });
      if (!event) throw new ApiError("Event not found", 404);

      // 2. Validasi ticket category dan kecocokan event
      const ticketCategory = await tx.ticketCategory.findUnique({
        where: { id: body.ticketCategoryId },
      });
      if (!ticketCategory || ticketCategory.eventId !== body.eventId) {
        throw new ApiError("Invalid or mismatched ticket category", 400);
      }

      const ticketPrice = Number(ticketCategory.price);
      const totalPrice = ticketPrice * body.quantity;

      // 3. Validasi voucher (jika ada)
      let discount = 0;
      let voucher = null;
      if (body.voucherCode) {
        voucher = await tx.voucher.findFirst({
          where: {
            code: body.voucherCode,
            isActive: true,
            organizerId: event.organizerId,
            quota: { gt: 0 },
          },
        });

        if (!voucher) {
          throw new ApiError("Invalid voucher", 400);
        }

        discount = voucher.discountAmount;
      }

      // 4. Hitung final price
      const usedPoints = body.usedPoints ?? 0;
      const finalPrice = Math.max(totalPrice - discount - usedPoints, 0);

      // 5. Pastikan tiket cukup
      if (ticketCategory.quota < body.quantity) {
        throw new ApiError("Not enough ticket quota", 400);
      }

      // 6. Kurangi kuota tiket
      await tx.ticketCategory.update({
        where: { id: body.ticketCategoryId },
        data: {
          quota: { decrement: body.quantity },
        },
      });

      // 7. Validasi dan catat pemakaian poin (jika ada)
      if (usedPoints > 0) {
        const now = new Date();
        const pointLogs = await tx.userPointLog.findMany({
          where: {
            userId: body.userId,
            OR: [{ type: "EARN", expiresAt: { gt: now } }, { type: "SPEND" }],
          },
        });

        const currentPoints = pointLogs.reduce((acc, log) => {
          return log.type === "EARN" ? acc + log.amount : acc - log.amount;
        }, 0);

        if (currentPoints < usedPoints) {
          throw new ApiError("Not enough points", 400);
        }

        await tx.userPointLog.create({
          data: {
            userId: body.userId,
            amount: usedPoints,
            type: "SPEND",
          },
        });
      }

      // 8. Kurangi kuota voucher (jika digunakan)
      if (voucher) {
        await tx.voucher.update({
          where: { id: voucher.id },
          data: {
            quota: { decrement: 1 },
          },
        });
      }

      // 9. Buat transaksi
      const transaction = await tx.transaction.create({
        data: {
          userId: body.userId,
          eventId: body.eventId,
          ticketCategoryId: body.ticketCategoryId,
          quantity: body.quantity,
          totalPrice: totalPrice,
          usedPoints: usedPoints,
          finalPrice: finalPrice,
          status: TransactionStatus.WAITING_PAYMENT,
          voucherId: voucher?.id,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 jam
        },
        include: {
          event: {
            select: {
              slug: true,
            },
          },
        },
      });

      return transaction;
    });
  };

  cancelTransaction = async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        ticketCategory: true,
        voucher: true,
        user: true,
      },
    });

    if (!transaction) throw new ApiError("Transaction not found");

    // 1. Return points
    if (transaction.usedPoints > 0) {
      await prisma.userPointLog.create({
        data: {
          userId: transaction.userId,
          amount: transaction.usedPoints,
          type: "EARN", // dianggap pengembalian
        },
      });
    }

    // 2. Restore voucher quota
    if (transaction.voucherId) {
      await prisma.voucher.update({
        where: { id: transaction.voucherId },
        data: {
          quota: { increment: 1 },
        },
      });
    }

    // 3. Restore ticket quota
    await prisma.ticketCategory.update({
      where: { id: transaction.ticketCategoryId },
      data: {
        quota: { increment: transaction.quantity },
      },
    });

    // 4. Update transaction status
    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.CANCELED,
      },
    });

    return { success: true };
  };

  uploadPaymentProof = async (transactionId: string, file: string) => {
    if (!file) {
      throw new ApiError("No file uploaded", 400);
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new ApiError("Transaction not found", 404);
    }

    if (transaction.status !== "WAITING_PAYMENT") {
      throw new ApiError(
        "Cannot upload proof. Transaction is not in 'WAITING_FOR_PAYMENT' state.",
        400
      );
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        paymentProofUrl: file,
        status: "WAITING_CONFIRMATION",
        updatedAt: new Date(),
      },
    });

    return updated;
  };

getTransactionsUserById = async ( userId: string) => {
 const transaction = await prisma.transaction.findMany({
  where: { userId },
  include: {
    user: true,
    event: true,
    ticketCategory: true,
    voucher: true,
    Ticket: true,
  },
});

  if (!transaction) {
    throw new ApiError("Transaction not found or not authorized", 404);
  }

  return transaction;
};

  getPaymentProof = async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      select: {
        paymentProofUrl: true,
      },
    });

    if (!transaction) {
      throw new ApiError("Transaction not found", 404);
    }

    return transaction.paymentProofUrl;
  };

  acceptTransaction = async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true, event: true, ticketCategory: true },
    });

    if (!transaction) throw new ApiError("Transaction not found", 404);
    if (transaction.status !== "WAITING_CONFIRMATION")
      throw new ApiError(
        "Transaction is not in 'WAITING_CONFIRMATION' state.",
        400
      );

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.DONE, updatedAt: new Date() },
    });

    // Send email
    await TransactionMailer.sendAcceptedMail({
      to: transaction.user.email,
      name: transaction.user.firstName || transaction.user.username,
      transactionId: transaction.id,
    });

    return updatedTransaction;
  };

  rejectTransaction = async (transactionId: string) => {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
        event: true,
        ticketCategory: true,
        voucher: true,
      },
    });

    if (!transaction) {
      throw new ApiError("Transaction not found", 404);
    }

    if (transaction.status !== "WAITING_CONFIRMATION") {
      throw new ApiError(
        "Transaction is not in 'WAITING_CONFIRMATION' state.",
        400
      );
    }

    // Restore ticket quota
    await prisma.ticketCategory.update({
      where: { id: transaction.ticketCategoryId },
      data: {
        quota: { increment: transaction.quantity },
      },
    });

    // Restore voucher quota if used
    if (transaction.voucherId) {
      await prisma.voucher.update({
        where: { id: transaction.voucherId },
        data: {
          quota: { increment: 1 },
        },
      });
    }

    // Update status to REJECTED
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status: TransactionStatus.REJECTED,
        updatedAt: new Date(),
      },
    });

    await TransactionMailer.sendRejectedMail({
      to: transaction.user.email,
      name: transaction.user.firstName || transaction.user.username,
      transactionId: transaction.id,
    });

    return updatedTransaction;
  };
  getPendingTransactionsByOrganizer = async (organizerId: string) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: TransactionStatus.WAITING_CONFIRMATION,
        event: {
          organizerId: organizerId,
        },
      },
      include: {
        user: true,
        event: true,
        ticketCategory: true,
        voucher: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return transactions;
  };
}
