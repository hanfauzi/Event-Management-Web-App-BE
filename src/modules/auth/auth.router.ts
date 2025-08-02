import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateBody } from "../../middlewares/validate.middleware";
import { RegisterDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";
import { EmailDTO } from "./dto/email.forgot.password.dto";
import { ForgotPasswordDTO } from "./dto/forgot.password.dto";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializedRoutes();
  }

  private initializedRoutes = () => {
    this.router.post(
      "/register",
      validateBody(RegisterDTO),
      this.authController.userRegister
    );
    this.router.post(
      "/register/organizer",
      validateBody(RegisterDTO),
      this.authController.organizerRegister
    );
    this.router.post(
      "/login",
      validateBody(LoginDTO),
      this.authController.userLogin
    );

    this.router.post(
      "/login/organizer",
      validateBody(LoginDTO),
      this.authController.organizerLogin
    );

    this.router.patch(
      "/forgot-password",
      validateBody(EmailDTO),
      this.authController.userEmailForgotPassword
    );

    this.router.patch(
      "/organizer/forgot-password",
      validateBody(EmailDTO),
      this.authController.organizerEmailForgotPassword
    );

    this.router.patch(
      "/forgot-password/:token",
      validateBody(ForgotPasswordDTO),
      this.authController.forgotUserPassword
    );

     this.router.patch(
    "/organizer/forgot-password/:token",
    validateBody(ForgotPasswordDTO),
    this.authController.forgotOrganizerPassword
    );
  };

  getRouter = () => {
    return this.router;
  };
}
