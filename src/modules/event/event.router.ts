import { Router } from "express";
import { EventController } from "./event.controller";
import { JwtVerify } from "../../middlewares/jwt.verify";

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
      JwtVerify.verifyToken,
      JwtVerify.verifyRole(["ORGANIZER"]),
      this.eventController.createEvent as any
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
