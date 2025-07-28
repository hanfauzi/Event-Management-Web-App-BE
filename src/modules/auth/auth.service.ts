import { ApiError } from "../../utils/api.error";
import { PasswordService } from "../password/password.service";
import prisma from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
  private passwordService: PasswordService;

  constructor() {
    this.passwordService = new PasswordService();
  }

  userRegister = async ({ username, email, password }: RegisterDTO) => {
    const findUserByEmail = await prisma.user.findFirst({ where: { email } });

    if (findUserByEmail) {
      throw new ApiError("Email already exist!", 400);
    }

    const findUserByUsername = await prisma.user.findFirst({
      where: { username },
    });

    if (findUserByUsername) {
      throw new ApiError("Username already used!", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const referralCode = generateReferralCode(username);

    return await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        referralCode,
      },
      select: {
        id: true,
        username: true,
        email: true,
        referralCode: true,
        createdAt: true,
      },
    });
    function generateReferralCode(username: string) {
      const suffix = Math.random().toString(36).substring(2, 6);
      return `ref_${username}_${suffix}`;
    }
  };

  organizerRegister = async ({ username, email, password }: RegisterDTO) => {
    const findOrganizerByEmail = await prisma.organizer.findFirst({
      where: { email },
    });

    if (findOrganizerByEmail) {
      throw new ApiError("Email already exist!", 400);
    }

    const findOrganizerByUsername = await prisma.organizer.findFirst({
      where: { username },
    });

    if (findOrganizerByUsername) {
      throw new ApiError("Username already used!", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    return await prisma.organizer.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  };
}
