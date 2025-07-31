import { Request, Response } from "express";
import { EventService } from "./event.service";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateEventDTO } from "./dto/create-event.dto";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";

export class EventController {
  private eventService: EventService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.eventService = new EventService();
    this.cloudinaryService = new CloudinaryService();
  }

  createEvent = async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const uploaded = await this.cloudinaryService.upload(file!, "event-images");

    const data = plainToInstance(CreateEventDTO, {
      ...req.body,
      imageURL: uploaded.secure_url,
    });
    const errors = await validate(data);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const organizer = res.locals.payload;
    console.log(organizer);

    const organizerId = organizer.userId;

    console.log(organizerId);
    const result = await this.eventService.createEvent(data, organizerId);
    res
      .status(201)
      .json({ message: "Event created successfully", data: result });
  };

  // display upcoming events
  displayUpcomingEvents = async (_: Request, res: Response) => {
    const result = await this.eventService.displayUpcomingEvents();
    res.status(200).json({ data: result });
  };

  //
}
