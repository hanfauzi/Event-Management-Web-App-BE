import { ApiError } from "../../utils/api.error";
import { PasswordService } from "../password/password.service";
import prisma from "../prisma/prisma.service";
import { OrganizerProfileUpdateDTO } from "./dto/org.profile.dto";
import { PasswordDTO } from "./dto/password.dto";
import { UserProfileUpdateDTO } from "./dto/profile.dto";

export class ProfileService {
  private passwordService: PasswordService;
  constructor() {
    this.passwordService = new PasswordService();
  }

  userProfileUpdate = async ({
    userId,
    firstName,
    lastName,
    username,
    phoneNumber,
    email,
    imageUrl,
  }: UserProfileUpdateDTO & { userId: string }) => {
    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      throw new ApiError("User not Found!", 404);
    }

    if (email && email !== user.email) {
      const existing = await prisma.user.findFirst({ where: { email } });
      if (existing) throw new ApiError("Email already used!", 400);
    }

    if (username && username !== user.username) {
      const existing = await prisma.user.findFirst({ where: { username } });
      if (existing) throw new ApiError("Username already used!", 400);
    }

    const dataToUpdate: UserProfileUpdateDTO = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(username && { username }),
      ...(phoneNumber && { phoneNumber }),
      ...(email && { email }),
      ...(imageUrl && { imageUrl }),
    };

    return await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        username: true,
        email: true,
        imageUrl: true,
      },
    });
  };

  organizerProfileUpdate = async ({
    organizerId,
    orgName,
    username,
    address,
    phoneNumber,
    email,
    bio,
    logoUrl,
  }: OrganizerProfileUpdateDTO & { organizerId: string }) => {
    const organizer = await prisma.organizer.findFirst({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new ApiError("Organizer not Found!", 404);
    }

    if (email && email !== organizer.email) {
      const existing = await prisma.organizer.findFirst({ where: { email } });
      if (existing) throw new ApiError("Email already used!", 400);
    }

    if (username && username !== organizer.username) {
      const existing = await prisma.organizer.findFirst({
        where: { username },
      });
      if (existing) throw new ApiError("Username already used!", 400);
    }

    const dataToUpdate: OrganizerProfileUpdateDTO = {
      ...(orgName && { orgName }),
      ...(address && { address }),
      ...(bio && { bio }),
      ...(username && { username }),
      ...(phoneNumber && { phoneNumber }),
      ...(email && { email }),
      ...(logoUrl && { logoUrl }),
    };

    const updatedOrganizer = await prisma.organizer.update({
      where: { id: organizerId },
      data: dataToUpdate,
    });

    // ✅ Cek apakah sudah lengkap & belum verified
    const isProfileComplete =
      updatedOrganizer.orgName &&
      updatedOrganizer.address &&
      updatedOrganizer.phoneNumber &&
      updatedOrganizer.email &&
      updatedOrganizer.bio &&
      updatedOrganizer.username &&
      updatedOrganizer.logoUrl;

    if (isProfileComplete && !updatedOrganizer.verified) {
      await prisma.organizer.update({
        where: { id: organizerId },
        data: { verified: true },
      });
    }

    return {
      orgName: updatedOrganizer.orgName,
      address: updatedOrganizer.address,
      bio: updatedOrganizer.bio,
      phoneNumber: updatedOrganizer.phoneNumber,
      username: updatedOrganizer.username,
      email: updatedOrganizer.email,
      logoUrl: updatedOrganizer.logoUrl,
      verified: updatedOrganizer.verified, // kalau kamu mau return juga
    };
  };

  getUserProfile = async (userId: string) => {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        referralCode: true,
        imageUrl: true,
      },
    });

    if (!user) {
      throw new ApiError("User not found!", 404);
    }

    return user;
  };

  getOrganizerProfile = async (organizerId: string) => {
    const organizer = await prisma.organizer.findFirst({
      where: { id: organizerId },
      select: {
        id: true,
        username: true,
        email: true,
        orgName: true,
        phoneNumber: true,
        address: true,
        bio: true,
        logoUrl: true,
      },
    });

    if (!organizer) {
      throw new ApiError("User not found!", 404);
    }

    return organizer;
  };

  userResetPassword = async ({
    userId,
    oldPassword,
    newPassword,
  }: PasswordDTO & { userId: string }) => {
    // 1. Ambil user dari DB
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError("User not Found!", 404);
    }

    // 2. Cek apakah oldPassword cocok
    const isMatch = await this.passwordService.comparePassword(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      throw new ApiError("Old password incorrect!", 400);
    }

    // 3. Hash newPassword
    const hashedNewPassword =
      await this.passwordService.hashPassword(newPassword);

    // 4. Update password di DB
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { message: "Change password successfull!" };
  };

  organizerResetPassword = async ({
    organizerId,
    oldPassword,
    newPassword,
  }: PasswordDTO & { organizerId: string }) => {
    // 1. Ambil user dari DB
    const organizer = await prisma.organizer.findFirst({
      where: { id: organizerId },
    });

    if (!organizer) {
      throw new ApiError("Organizer not Found!", 404);
    }

    // 2. Cek apakah oldPassword cocok
    const isMatch = await this.passwordService.comparePassword(
      oldPassword,
      organizer.password
    );

    if (!isMatch) {
      throw new ApiError("Old password incorrect!", 400);
    }

    // 3. Hash newPassword
    const hashedNewPassword =
      await this.passwordService.hashPassword(newPassword);

    // 4. Update password di DB
    await prisma.organizer.update({
      where: { id: organizer.id },
      data: { password: hashedNewPassword },
    });

    return { message: "Change password successfull!" };
  };
}
