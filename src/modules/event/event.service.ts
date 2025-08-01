import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api.error";
import { timeStringToDate } from "../../utils/time";
import prisma from "../prisma/prisma.service";
import { CreateEventDTO, EventStatus } from "./dto/create-event.dto";
import { GetEventsDTO } from "./dto/get-events.dto";

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
        startDay: startDate,
        endDay: endDate,
        startTime: startDateTime,
        endTime: endDateTime,
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

  getEvents = async (query: GetEventsDTO) => {
    const { take, page, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.EventWhereInput = {};

    if (search) {
      whereClause.title = { contains: search, mode: "insensitive" };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take: take,
      include: { organizer: true },
    });

    const total = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total },
    };
  };

  // tampilan detail events yang dipilih
  getEventById = () => {};

  // filter events by category atau location
  filterEventsByCategoryOrLocation = () => [];
}
