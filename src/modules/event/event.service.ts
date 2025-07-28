import { ApiError } from "../../utils/api.error";
import prisma from "../prisma/prisma.service";
import { CreateEventDTO } from "./dto/create-event.dto";

export class EventService {
  createEvent = async (dto: CreateEventDTO, organizerId: string) => {
    const {
      title,
      startTime,
      endTime,
      category,
      location,
      description,
      imageURL,
      price,
      maxCapacity,
      status,
    } = dto;

    const organizerRole = prisma.user.findFirst({where: {role: "ORGANIZER"}})

    const username = prisma.user.findFirst({where: {}})

    if(!organizerRole) {
      throw new ApiError("Unathorized", 401)
    }

    return prisma.event.create({
      data: {
        title,
        startTime,
        endTime,
        category,
        location,
        description,
        imageURL,
        price,
        maxCapacity,
        status,
        organizerId,
      },
    });
  };

  // tampilan landing page untuk semua event tersedia
  displayUpcomingEvents = async() => {
    return prisma.event.findMany({where: {status: "UPCOMING"}})
    
  }

  // tampilan detail events yang dipilih
  getEventById = () => {}

  // filter events by category atau location
  filterEventsByCategoryOrLocation = () => []


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