import { Request, Response } from "express";
import { CloudinaryService } from "../../cloudinary/cloudinary.service";
import { ProfileService } from "./profile.service";

export class ProfileController {
  private profileService: ProfileService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.profileService = new ProfileService();
    (this, (this.cloudinaryService = new CloudinaryService()));
  }

  userProfileUpdate = async (req: Request, res: Response) => {
    const file = req.file;
    const userId = res.locals.payload.userId;

    const uploaded = await this.cloudinaryService.upload(
      file!,
      "photo-profile"
    );

    const result = await this.profileService.userProfileUpdate({
      userId,
      ...req.body,
      imageUrl: uploaded.secure_url,
    });

    res.status(200).send(result);
  };

  organizerProfileUpdate = async (req: Request, res: Response) => {
    const file = req.file;
    const organizerId = res.locals.payload.userId;

    const uploaded = await this.cloudinaryService.upload(
      file!,
      "logo-organizer"
    );

    const result = await this.profileService.organizerProfileUpdate({
      organizerId,
      ...req.body,
      logoUrl: uploaded.secure_url,
    });

    res.status(200).send(result);
  };

  userProfile = async (req: Request, res: Response) => {
    const userId = res.locals.payload.userId;
    const result = await this.profileService.getUserProfile(userId);

    res.status(200).send(result);
  };

  organizerProfile = async (req: Request, res: Response) => {
    const organizerId = res.locals.payload.userId;
    const result = await this.profileService.getOrganizerProfile(organizerId);

    res.status(200).send(result);
  };
}
