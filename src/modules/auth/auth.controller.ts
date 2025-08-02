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

  userLogin = async (req: Request, res: Response) => {
    const result = await this.authService.userLogin(req.body);
    res.status(200).send(result);
  };

  organizerLogin = async (req: Request, res: Response) => {
    const result = await this.authService.organizerLogin(req.body);
    res.status(200).send(result);
  };

  userEmailForgotPassword = async (req:Request, res: Response) => {
    const result = await this.authService.sendUserForgotPasswordEmail(req.body)
    res.status(200).send(result)
  }

  organizerEmailForgotPassword = async (req:Request, res: Response) => {
    const result = await this.authService.sendOrganizerForgotPasswordEmail(req.body)
    res.status(200).send(result)
  }

  forgotUserPassword = async (req:Request, res: Response) => {
    const {token} = req.params
    const {newPassword} = req.body

    const result = await this.authService.forgotUserPasswordByToken({token, newPassword})
    res.status(200).send(result);
  }

  forgotOrganizerPassword = async (req:Request, res: Response) => {
    const {token} = req.params
    const {newPassword} = req.body

    const result = await this.authService.forgotOrganizerPasswordByToken({token, newPassword})
    res.status(200).send(result);
  }
}
