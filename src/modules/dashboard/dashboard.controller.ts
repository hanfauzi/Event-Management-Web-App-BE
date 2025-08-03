import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  private dashboardService: DashboardService;
  constructor() {
    this.dashboardService = new DashboardService();
  }

  getSummary = async (req: Request, res: Response) => {
    const organizerId = res.locals.payload.userId;
    const data = await this.dashboardService.getSummary(organizerId);
    res.status(200).json(data);
  };

  getOverview = async (req: Request, res: Response) => {
    const organizerId = res.locals.payload.userId;
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const data = await this.dashboardService.getMonthlySales(organizerId, year);
    res.status(200).json(data);
  };

  getRecentSales = async (req: Request, res: Response) => {
    const organizerId = res.locals.payload.userId;
    const limit = parseInt(req.query.limit as string) || 5;
    const data = await this.dashboardService.getRecentSales(organizerId, limit);
    res.json(data);
  };
}
