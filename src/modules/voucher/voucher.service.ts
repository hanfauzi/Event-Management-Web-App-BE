import { CreateVoucherDto } from "./dto/create.voucher.dto";
import prisma from "../prisma/prisma.service";
import { ApiError } from "../../utils/api.error";

export class VoucherService {
  // Method to create a new voucher
  createVoucher = async (organizerId: string, body: CreateVoucherDto) => {
    const { code, quota, discountAmount, startDate, endDate, eventId } = body;

    // 1. Validasi tanggal
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end)
      throw new ApiError("Start date must be before end date", 400);
    if (end < now) throw new ApiError("End date must be in the future", 400);

    // 2. Cek apakah event benar-benar milik organizer
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        organizerId,
      },
    });
    if (!event)
      throw new ApiError("Event not found or not owned by this organizer", 404);

    // 3. Cek apakah kode voucher sudah ada
    const existing = await prisma.voucher.findFirst({
      where: { code, eventId },
    });
    if (existing) throw new ApiError("Voucher code already exists", 400);

    // 4. Buat voucher
    const voucher = await prisma.voucher.create({
      data: {
        code,
        quota,
        discountAmount,
        startDate: start,
        endDate: end,
        isActive: true,
        organizerId,
        eventId,
      },
    });

    return voucher;
  };

  // Method to validate voucher
  validateVoucher = async (code: string, eventId: string) => {
    const now = new Date();

    // 1. Cek apakah voucher ada
    const voucher = await prisma.voucher.findFirst({
      where: {
        code,
        eventId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
        quota: { gt: 0 },
      },
    });

    return voucher;
  };

  getInfoVouchers = async (organizerId: string) => {
  const vouchers = await prisma.voucher.findMany({
    where: {
      organizerId,
    },
    include: {
      event: {
        select: {
          title: true,
          location: true,
          startDay: true,
        },
      },
    },
    orderBy: {
      startDate: "desc",
    },
  });
  console.log("Ditemukan voucher:", vouchers);

  return vouchers;
};
}
