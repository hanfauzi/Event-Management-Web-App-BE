import { Router } from "express";
import { EventController } from "./event.controller";
import { JwtVerify } from "../../middlewares/jwt.verify";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";

export class EventRouter {
  private router: Router;
  private eventController: EventController;
  private uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.uploaderMiddleware = new UploaderMiddleware();
    this.initializedRoutes();
  }
  private initializedRoutes = () => {
    this.router.post(
      "/create-event",
      JwtVerify.verifyToken,
      JwtVerify.verifyRole(["ORGANIZER"]),
      this.uploaderMiddleware.upload().single("image"),
      this.eventController.createEvent as any
    );
    this.router.get("/events", this.eventController.getEvents);
    this.router.get(
      "/filtered-events",
      this.eventController.filterEventsByCategoryOrLocation
    );
    this.router.get("/event/:slug", this.eventController.getEventDetailBySlug);
    this.router.get("/events/:id",JwtVerify.verifyToken, this.eventController.eventById);
    this.router.get("/organizer/events", JwtVerify.verifyToken, this.eventController.eventsByOraganizerId)
    this.router.patch(
      "/edit-event/:id",
      JwtVerify.verifyToken,
      this.uploaderMiddleware.upload().single("image"),
      this.eventController.eventUpdate
    );
    this.router.get(
      "/:eventId/attendees",
      JwtVerify.verifyToken,JwtVerify.verifyRole(["ORGANIZER"]),
      this.eventController.getAttendees
    );
  };

  getRouter = () => {
    return this.router;
  };
}
