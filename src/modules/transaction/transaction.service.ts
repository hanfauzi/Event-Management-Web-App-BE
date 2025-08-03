import prisma from "../prisma/prisma.service";
import { TransactionStatus } from "../../generated/prisma";
import { CreateTransactionDTO } from "./dto/create.transaction.dto";
import { ApiError } from "../../utils/api.error";

export class TransactionService {


 createTransaction = async (body: CreateTransactionDTO) => {
  // 1. Cek apakah event ada
  const event = await prisma.event.findUnique({
    where: { id: body.eventId },
  });
  if (!event) throw new ApiError("Event not found");

  // 2. Validasi ticket category dan kecocokan event
  const ticketCategory = await prisma.ticketCategory.findUnique({
    where: { id: body.ticketCategoryId },
  });
  if (!ticketCategory || ticketCategory.eventId !== body.eventId) {
    throw new ApiError("Invalid or mismatched ticket category");
  }

  const ticketPrice = Number(ticketCategory.price);
  const totalPrice = ticketPrice * body.quantity;

  // 3. Validasi voucher (jika ada)
  let discount = 0;
  let voucher = null;
  if (body.voucherId) {
    voucher = await prisma.voucher.findUnique({
      where: { id: body.voucherId },
    });

    if (
      !voucher ||
      !voucher.isActive ||
      voucher.organizerId !== event.organizerId ||
      voucher.quota <= 0
    ) {
      throw new ApiError("Invalid voucher");
    }

    discount = voucher.discountAmount;
  }

  // 4. Hitung final price
  const usedPoints = body.usedPoints ?? 0;
  const finalPrice = Math.max(totalPrice - discount - usedPoints, 0);

  // 5. Pastikan tiket cukup
  if (ticketCategory.quota < body.quantity) {
    throw new ApiError("Not enough ticket quota");
  }

  // 6. Kurangi kuota tiket
  await prisma.ticketCategory.update({
    where: { id: body.ticketCategoryId },
    data: {
      quota: { decrement: body.quantity },
    },
  });

  // 7. Validasi dan catat pemakaian poin (jika ada)
  if (usedPoints > 0) {
    const now = new Date();
    const pointLogs = await prisma.userPointLog.findMany({
      where: {
        userId: body.userId,
        OR: [{ type: "EARN", expiresAt: { gt: now } }, { type: "SPEND" }],
      },
    });

    const currentPoints = pointLogs.reduce((acc, log) => {
      return log.type === "EARN" ? acc + log.amount : acc - log.amount;
    }, 0);

    if (currentPoints < usedPoints) {
      throw new ApiError("Not enough points");
    }

    await prisma.userPointLog.create({
      data: {
        userId: body.userId,
        amount: usedPoints,
        type: "SPEND",
      },
    });
  }

  // 8. Kurangi kuota voucher (jika digunakan)
  if (voucher) {
    await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        quota: { decrement: 1 },
      },
    });
  }

  // 9. Buat transaksi
  const transaction = await prisma.transaction.create({
    data: {
      userId: body.userId,
      eventId: body.eventId,
      ticketCategoryId: body.ticketCategoryId,
      quantity: body.quantity,
      totalPrice: totalPrice,
      usedPoints: usedPoints,
      finalPrice: finalPrice,
      status: TransactionStatus.WAITING_PAYMENT,
      voucherId: body.voucherId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 jam
    },
  });

  return transaction;
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
}
