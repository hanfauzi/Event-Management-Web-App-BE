import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { JwtVerify } from "../../middlewares/jwt.verify";

export class DashboardRouter {
  private router: Router;
  private dashboardController: DashboardController;
  constructor() {
    this.router = Router();
    this.dashboardController = new DashboardController();
    this.initializedRoutes();
  }
  private initializedRoutes = () => {
    this.router.get(
      "/organizer/dashboard",
      JwtVerify.verifyToken,
      this.dashboardController.getSummary
    );
    this.router.get(
      "/organizer/dashboard/overview",
      JwtVerify.verifyToken,
      this.dashboardController.getOverview
    );
    this.router.get(
      "/organizer/dashboard/sales",
      JwtVerify.verifyToken,
      this.dashboardController.getRecentSales
    );
  };

  getRouter = () => {
    return this.router;
  };
}
