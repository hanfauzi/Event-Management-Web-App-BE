import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator";

export class OrganizerProfileUpdateDTO {
  @IsString()
  @IsOptional()
  orgName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
