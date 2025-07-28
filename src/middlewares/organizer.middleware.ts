import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.error";

export const isOrganizer = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as {id: string; role: string }

    if(!user || user.role !== "ORGANIZER") {
        throw new ApiError("Access denied!", 403) 
    }
    next()
}