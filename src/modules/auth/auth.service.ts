// import { User } from "../generated/prisma";
// import prisma from "../db/connection";
// import { APIError } from "../utils/api.error";
// import { hashPassword } from "../lib/bcrypt";

// export const registerUsersService = async ({
//   username,
//   email,
//   password,
// }: Pick<User, "username" | "email" | "password">) => {
//   // Cek email sudah digunakan
//   const findUserByEmail = await prisma.user.findUnique({ where: { email } });
//   if (findUserByEmail) {
//     throw APIError("Email is already registered", 400);
//   }

//   // Cek username sudah digunakan
//   const findUserByUsername = await prisma.user.findFirst({
//     where: { username },
//   });
//   if (findUserByUsername) {
//     throw APIError("Username is already taken", 400);
//   }

//   // Hash password
//   const hashedPassword = await hashPassword(password);

//   // Generate referral code
//   const referralCode = generateReferralCode(username);

//   // Create user
//   const newUser = await prisma.user.create({
//     data: {
//       username,
//       email,
//       password: hashedPassword,
//       role: "USER",

//       // Default untuk field yang wajib
//       firstName: "-",
//       lastName: "-",
//       address: "-",
//       phoneNumber: "-",
//       photoUrl: "-",
//       referralCode,
//     },
//     select: {
//       id: true,
//       username: true,
//       email: true,
//       role: true,
//       referralCode: true,
//       createdAt: true,
//     },
//   });

//   return {
//     message: "Account registered successfully",
//     user: newUser,
//   };
// };

// // Fungsi helper untuk generate referral code unik
// function generateReferralCode(username: string) {
//   const suffix = Math.random().toString(36).substring(2, 6);
//   return `ref_${username}_${suffix}`;
// }
import { ApiError } from "../../utils/api.error";
import { PasswordService } from "../password/password.service";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";

export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;

  constructor() {
    this.prisma = new PrismaService();
    this.passwordService = new PasswordService();
  }

  userRegister = async ({ username, email, password }: RegisterDTO) => {
    const userEmail = await this.prisma.user.findFirst({ where: { email } });

    if (userEmail) {
      throw new ApiError("Email already exist!", 400);
    }

    const userUName = await this.prisma.user.findFirst({ where: { username } });

    if (userUName) {
      throw new ApiError("Username already used!", 400);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);
    const referralCode = generateReferralCode(username);

    return await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER",
        firstName: "-",
        lastName: "-",
        address: "-",
        phoneNumber: "-",
        photoUrl: "-",
        referralCode,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        referralCode: true,
        createdAt: true,
      },
    });
    function generateReferralCode(username: string) {
      const suffix = Math.random().toString(36).substring(2, 6);
      return `ref_${username}_${suffix}`;
    }
  };

  registerOrganizer = async () => {};
}
