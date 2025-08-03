import { Prisma } from "../../generated/prisma";
import { ApiError } from "../../utils/api.error";
import { generateSlug } from "../../utils/generate-slug";
import { timeStringToDate } from "../../utils/time";
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

    // 2. Ambil field dari body
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

    // 3. Validasi tanggal
    const startDate = new Date(startDay);
    const endDate = new Date(endDay);

    const generateUniqueSlug = async (title: string): Promise<string> => {
      const baseSlug = generateSlug(title);
      let slug = baseSlug;
      let count = 1;

      while (await prisma.event.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${count}`;
        count++;
      }
      return slug;
    };

    const slug = await generateUniqueSlug(title);

    // 4. Create event
    return prisma.event.create({
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
      include: { organizer: { select: { orgName: true } } },
    });

    const total = await prisma.event.count({ where: whereClause });

    return {
      data: events,
      meta: { page, take, total },
    };
  };

  // filter events by category atau location
  filterEventsByCategoryOrLocation = async (query: FilterEventsDTO) => {
    const { category, location, search, page = 1, take = 8 } = query;

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
    price,
    status,
    maxCapacity,
  }: EditEventDTO & { id: string; organizerId: string }) => {
    const organizer = await prisma.organizer.findFirst({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new ApiError("Organizer not found!", 404);
    }
    const updated = await prisma.event.update({
      where: { id },
      data: {
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
        price,
        status,
        maxCapacity,
      },
    });

    return updated;
  };
}
