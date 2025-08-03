import prisma from "../prisma/prisma.service";

export class DashboardService {
  getSummary = async (organizerId: string) => {
    const totalEvents = await prisma.event.count({
      where: { organizerId },
    });

    const totalTickets = await prisma.ticket.count({
      where: {
        event: { organizerId },
      },
    });

    const totalVouchers = await prisma.voucher.count({
      where: { organizerId },
    });

    const totalRevenue = await prisma.transaction.aggregate({
      where: {
        event: { organizerId },
        status: "DONE", // atau tergantung definisi suksesmu
      },
      _sum: {
        totalPrice: true,
      },
    });

    return {
      totalEvents,
      totalTickets,
      totalVouchers,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
    };
  };

getMonthlySales = async (organizerId: string, year: number) => {
  const result = await prisma.transaction.findMany({
    where: {
      event: { organizerId },
      status: "DONE",
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
    select: {
      createdAt: true,
      totalPrice: true,
    },
  });

  const monthly = Array(12).fill(0);
  result.forEach((item) => {
    const month = new Date(item.createdAt).getMonth(); // 0 = Jan, 11 = Dec
    monthly[month] += Number(item.totalPrice ?? 0);
  });

  return monthly;
};


  getRecentSales = async (organizerId: string, limit: number) => {
    const result = await prisma.transaction.findMany({
      where: {
        event: { organizerId },
        status: "DONE",
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        event: { select: { title: true } },
        user: { select: { username: true, email: true } },
      },
    });

    return result;
  };
}
