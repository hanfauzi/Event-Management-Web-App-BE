import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api.error";
import { generateUniqueSlug } from "../../utils/unique-slug";
import prisma from "../prisma/prisma.service";
import { CreateEventDTO, EventStatus } from "./dto/create-event.dto";
import { EditEventDTO } from "./dto/edit-event.dot";
import { FilterEventsDTO } from "./dto/filter-events.dto";
import { GetEventsDTO } from "./dto/get-events.dto";

export class EventService {
 createEvent = async (body: CreateEventDTO, organizerId: string) => {
  // 1. Cek apakah organizer verified
  const organizer = await prisma.organizer.findFirst({
    where: { id: organizerId },
    select: { verified: true },
  });

  if (!organizer) {
    throw new ApiError("Organizer not found", 404);
  }

  if (!organizer.verified) {
    throw new ApiError(
      "Your profile is not verified. Complete your profile first.",
      403
    );
  }

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
    status,
    maxCapacity,
    ticketCategories,
  } = body;

  const startDate = new Date(startDay);
  const endDate = new Date(endDay);

  const slug = await generateUniqueSlug(title);

  // 2. Transaction
  const createdEvent = await prisma.$transaction(async (tx) => {
    const createdEvent = await tx.event.create({
      data: {
        title,
        slug,
        startDay: startDate,
        endDay: endDate,
        startTime,
        endTime,
        category,
        location,
        description,
        imageURL,
        maxCapacity,
        status: status ?? EventStatus.UPCOMING,
        organizerId,
      },
    });

    await tx.ticketCategory.createMany({
      data: ticketCategories.map((tc) => ({
        name: tc.name,
        price: tc.price,
        quota: tc.quota,
        eventId: createdEvent.id,
      })),
    });

    return createdEvent;
  });

  // 3. Ambil data lengkap setelah transaction sukses
  const completeEventInfo = await prisma.event.findUnique({
    where: { id: createdEvent.id },
    include: {
      ticketCategories: true,
      organizer: { select: { orgName: true } },
    },
  });

  return completeEventInfo;
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
      include: {
        organizer: { select: { orgName: true } },
        ticketCategories: true,
      },
    });

    const total = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total },
    };
  };

  // filter events by category atau location
  filterEventsByCategoryOrLocation = async (query: FilterEventsDTO) => {
    const { category, location, search } = query;
    const page = parseInt(query.page as any) || 1;
    const take = parseInt(query.take as any) || 8;

    const whereClause: Prisma.EventWhereInput = {};

    if (category) whereClause.category = category;
    if (location)
      whereClause.location = { contains: location, mode: "insensitive" };
    if (search) whereClause.title = { contains: search, mode: "insensitive" };

    const events = await prisma.event.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: { startDay: "asc" },
    });

    const total = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total },
    };
  };

  // get detail event berdasarkan slug
  getEventDetailBySlug = async (slug: string) => {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        ticketCategories: true,
        organizer: {
          select: { orgName: true },
        },
      },
    });

    if (!event) {
      throw new ApiError("Event not found", 404);
    }

    return event;
  };

 getEventById = async (eventId: string, organizerId: string) => {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      organizerId, // <-- validasi bahwa ini memang event-nya
    },
    include: {
      ticketCategories: true,
    },
  });

  if (!event) {
    throw new ApiError("Event not found or not yours!", 404);
  }

  return event;
};

getEventsByOrganizerId = async (organizerId: string) => {
  const events = await prisma.event.findMany({
    where: {
      organizerId,
    },
    orderBy: {
      createdAt: "desc", // optional: urut dari yang terbaru
    },
  });

  return events;
};

  eventUpdate = async ({
    id,
    organizerId,
    title,
    startDay,
    endDay,
    startTime,
    endTime,
    category,
    location,
    description,
    imageURL,
    status,
    maxCapacity,
  }: EditEventDTO & { id: string; organizerId: string }) => {
    const organizer = await prisma.organizer.findFirst({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new ApiError("Organizer not found!", 404);
    }

    const startDate = new Date(`${startDay}T00:00:00Z`);
    const endDate = new Date(`${endDay}T00:00:00Z`);
    const slug = await generateUniqueSlug(title!);
    const updated = await prisma.event.update({
      where: { id },
      data: {
        organizerId,
        title,
        slug,
        startDay: startDate,
        endDay: endDate,
        startTime,
        endTime,
        category,
        location,
        description,
        imageURL,
        status,
        maxCapacity,
      },
    });

    return updated;
  };

   getAttendees = async (eventId: string) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        eventId,
        status: "DONE",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return transactions.map(tx => ({
      userId: tx.user.id,
      name: `${tx.user.firstName ?? ""} ${tx.user.lastName ?? ""}`.trim() || tx.user.username,
      email: tx.user.email,
      ticketQuantity: tx.quantity,
      totalPaid: tx.finalPrice,
    }));
  };
}
