// src/helpers/rollbackTransaction.ts
import prisma from "../modules/prisma/prisma.service";

export const rollbackTransaction = async (transactionId: string) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      ticketCategory: true,
      voucher: true,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  const ops = [];

  // 1. Kembalikan kuota tiket
  ops.push(
    prisma.ticketCategory.update({
      where: { id: transaction.ticketCategoryId },
      data: {
        quota: {
          increment: transaction.quantity,
        },
      },
    })
  );

  // 2. Kembalikan kuota voucher (jika ada)
  if (transaction.voucherId) {
    ops.push(
      prisma.voucher.update({
        where: { id: transaction.voucherId },
        data: {
          quota: {
            increment: 1,
          },
        },
      })
    );
  }

  // 3. Kembalikan poin user (jika ada)
  if (transaction.usedPoints > 0) {
    ops.push(
      prisma.userPointLog.create({
        data: {
          userId: transaction.userId,
          amount: transaction.usedPoints,
          type: "EARN", // bisa juga pakai type: "ROLLBACK" kalau kamu pisahkan
        },
      })
    );
  }

  // 4. Ubah status transaksi ke EXPIRED atau CANCELED
  ops.push(
    prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: "EXPIRED", // atau "CANCELED" sesuai konteks pemanggilnya
      },
    })
  );

  await prisma.$transaction(ops);
};
