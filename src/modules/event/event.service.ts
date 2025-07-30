import { ApiError } from "../../utils/api.error";
import { timeStringToDate } from "../../utils/time";
import prisma from "../prisma/prisma.service";
import { CreateEventDTO, EventStatus } from "./dto/create-event.dto";

export class EventService {
  createEvent = async (body: CreateEventDTO, organizerId: string) => {
    const {
      title,
      startDay,
      endDay,
      startTime,
      endTime,
      category,
      location,
      description,
      imageURL,
      price,
      status,
      maxCapacity,
    } = body;

  

   
    const startDate = new Date(startDay);
    const endDate = new Date(endDay);
    const startDateTime = timeStringToDate(startDay, startTime);
    const endDateTime = timeStringToDate(endDay, endTime);

    if (endDate < startDate) {
      throw new ApiError("End date must be after or equal to start date", 400);
    }

    if (endDateTime <= startDateTime) {
      throw new ApiError("End time must be after start time", 400);
    }

    return prisma.event.create({
      data: {
        title,
        startDay,
        endDay,
        startTime,
        endTime,
        category,
        location,
        description,
        imageURL,
        price,
        maxCapacity,
        status: status ?? EventStatus.UPCOMING,
        organizerId,
      },
    });
  };

  // tampilan landing page untuk semua event tersedia
  displayUpcomingEvents = async () => {
    return prisma.event.findMany({ where: { status: "UPCOMING" } });
  };

  // tampilan detail events yang dipilih
  getEventById = () => {};

  // filter events by category atau location
  filterEventsByCategoryOrLocation = () => [];
}

// user dan organizer di pisah
// start day dan end day ditambahkan
// kelas category tiket dimasukkan juga
// qty hapus
// coupon dan voucher disatukan
// userId tidak diperlukan di tiket
// proteksi max pembelian tiket dalam 1 user
// tambahkan kuota voucher
// address penting untuk organizer , bukan untuk user
