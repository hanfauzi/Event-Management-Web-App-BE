// src/jobs/expirePendingTransactionJob.ts
import cron from "node-cron";
import prisma from "../../modules/prisma/prisma.service";

const formatToWIB = (date: Date): string =>
  date.toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

const expirePendingTransactions = async () => {
  const now = new Date();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: "WAITING_PAYMENT",
        expiresAt: { lte: now },
      },
    });

    if (transactions.length === 0) {
      console.log(`[CRON ✅] Tidak ada transaksi EXPIRED pada ${formatToWIB(now)} WIB`);
      return;
    }

    let successCount = 0;
    for (const tx of transactions) {
      await prisma.$transaction(async (txPrisma) => {
        // 1. Tandai transaksi sebagai EXPIRED
        await txPrisma.transaction.update({
          where: { id: tx.id },
          data: { status: "EXPIRED" },
        });

        // 2. Kembalikan poin user (jika ada)
        if (tx.usedPoints > 0) {
          await txPrisma.user.update({
            where: { id: tx.userId },
            data: {
              userPointLogs: {
                create: {
                  amount: tx.usedPoints,
                  type: "EARN",
                  id: tx.userId,
                  
                },
              },
            },
          });
        }

        // 3. Kembalikan kuota voucher jika ada
        if (tx.voucherId) {
          await txPrisma.voucher.update({
            where: { id: tx.voucherId },
            data: {
              quota: { increment: 1 },
            },
          });
        }

        // 4. Kembalikan kuota tiket
        await txPrisma.ticketCategory.update({
          where: { id: tx.ticketCategoryId },
          data: {
            quota: { increment: tx.quantity },
          },
        });

        successCount++;
      });
    }

    console.log(
      `[CRON ✅] ${successCount}/${transactions.length} transaksi expired berhasil di-rollback pada ${formatToWIB(now)} WIB`
    );
  } catch (error) {
    console.error(`[CRON ❌] Gagal memproses transaksi expired pada ${formatToWIB(now)} WIB:`, error);
  }
};

const startExpireTransactionJob = () => {
  console.log("[CRON] Job expirePendingTransactions dijadwalkan setiap 5 menit.");
  cron.schedule("*/5 * * * *", expirePendingTransactions, {
    timezone: "Asia/Jakarta",
  });
};

export default startExpireTransactionJob;
