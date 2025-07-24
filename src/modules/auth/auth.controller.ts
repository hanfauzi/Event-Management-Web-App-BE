
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
  
  organizerRegister = async (req: Request, res: Response) => {
    
    const result = await this.authService.organizerRegister(req.body);
    res.status(200).send(result);
    
  };
}
