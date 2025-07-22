import { Request, Response } from "express";
import { registerUsersService } from "../services/auth.service";

export const registerController = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const result = await registerUsersService({ username, email, password });

  res.status(200).json({
    success: true,
    message: "Create Account Successfull",
    result: result,
  });
};
