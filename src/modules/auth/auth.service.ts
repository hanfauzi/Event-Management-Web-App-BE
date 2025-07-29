import { createToken } from "../../lib/jwt";
import { ApiError } from "../../utils/api.error";
import { PasswordService } from "../password/password.service";

import prisma from "../prisma/prisma.service";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO } from "./dto/register.dto";
import bcrypt from "bcrypt";

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

  userLogin = async ({ usernameOrEmail, password }: LoginDTO) => {
    const isEmail = usernameOrEmail.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!user) {
      throw new ApiError("Account not registered!", 404);
    }

    const comparedPassword = await this.passwordService.comparePassword(
      password,
      user.password
    );

    if (!comparedPassword) {
      throw new ApiError("Password Invalid!", 401);
    }

    const token = await createToken({
      userId: user.id,
      role: user.role,
      secretKey: process.env.JWT_SECRET_KEY!,
      options: { expiresIn: "1h" },
    });

    return { token, id: user.id, role: user.role };
  };

  organizerLogin = async ({ usernameOrEmail, password }: LoginDTO) => {
    const isEmail = usernameOrEmail.includes("@");
    const organizer = await prisma.organizer.findFirst({
      where: isEmail
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    });

    if (!organizer) {
      throw new ApiError("Account not registered!", 404);
    }

    const comparedPassword = await this.passwordService.comparePassword(
      password,
      organizer.password
    );

    if (!comparedPassword) {
      throw new ApiError("Password Invalid!", 401);
    }

    const token = await createToken({
      userId: organizer.id,
      role: organizer.role,
      secretKey: process.env.JWT_SECRET_KEY!,
      options: { expiresIn: "1h" },
    });

    return { token, id: organizer.id, role: organizer.role };
  };
}
