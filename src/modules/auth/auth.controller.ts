// import { Request, Response } from "express";

// import { registerUsersService } from "../services/auth.service";
// export const registerController = async (req: Request, res: Response) => {
//   const { username, email, password } = req.body;

//   const result = await registerUsersService({ username, email, password });

//   res.status(200).json({
//     success: true,
//     message: "Create Account Successfull",
//     result: result,
//   });
// };
import { Request, Response } from "express";
import { AuthService } from "./auth.service";


export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    
  }

  userRegister = async (req: Request, res: Response) => {
    
    const result = await this.authService.userRegister(req.body);
    res.status(200).send(result);
    
  };
}
