import { Request, Response } from "express";
import { EventService } from "./event.service";

export class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  createEvent = async (req: Request, res: Response) => {
    const dto = req.body;
    const user = (req as any).user;
    const organizerId = user.id; // masih contoh, dan akan diperbaiki agar lebih dinamis
  

    console.log(organizerId);
    const result = await this.eventService.createEvent(dto, organizerId);
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
