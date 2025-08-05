// src/jobs/expirePendingTransactionJob.ts
import cron from "node-cron"
import prisma from "../../modules/prisma/prisma.service";
import { subHours } from "date-fns";

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
  try {

    const now = new Date()

    const expiredTransactions = await prisma.transaction.updateMany({
      where: {
        status: 'WAITING_PAYMENT',
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    console.log(
      `[CRON] ${expiredTransactions.count} transaksi kedaluwarsa diubah ke EXPIRED pada ${formatToWIB(now)} WIB`
    );
  } catch (error) {
    console.error('[CRON ERROR] Gagal update transaksi:', error);
  }
};

// Schedule: tiap 5 menit
const startExpireTransactionJob = () => {
  cron.schedule('*/5 * * * *', expirePendingTransactions);
};

export default  startExpireTransactionJob;
