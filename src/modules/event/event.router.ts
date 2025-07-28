import { Router } from "express";
import { EventController } from "./event.controller";
import { isOrganizer } from "../../middlewares/organizer.middleware";

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initializedRoutes();
  }
  private initializedRoutes = () => {
    this.router.post(
      "/create-event",
      isOrganizer,
      this.eventController.createEvent
    );
    this.router.get(
      "/upcoming-events",
      this.eventController.displayUpcomingEvents
    );
  };

  getRouter = () => {
    return this.router;
  };
}
