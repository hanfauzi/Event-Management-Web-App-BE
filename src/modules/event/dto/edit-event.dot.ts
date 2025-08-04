import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  ValidateNested,
} from "class-validator";
import { CreateTicketCategoryDTO } from "./create-ticket-category.dto";

export enum Category {
  CULINARY = "CULINARY",
  MUSIC = "MUSIC",
  SPORT = "SPORT",
  COMEDY = "COMEDY",
  WORKSHOP = "WORKSHOP",
  ART = "ART",
  TRAVEL = "TRAVEL",
  EDUCATION = "EDUCATION",
  COMMUNITY = "COMMUNITY",
  FASHION = "FASHION",
  GAMING = "GAMING",
  HEALTH = "HEALTH",
  FAMILY = "FAMILY",
  RELIGION = "RELIGION",
  OTHER = "OTHER",
}

export enum EventStatus {
  UPCOMING = "UPCOMING",
  ONGOING = "ONGOING",
  DONE = "DONE",
}

export class EditEventDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsDateString()
  startDay?: string; // Format: YYYY-MM-DD

  @IsOptional()
  @IsDateString()
  endDay?: string;

  @IsOptional()
  @IsString()
  startTime?: string; // Format: HH:mm

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageURL?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketCategoryDTO)
  ticketCategories?: CreateTicketCategoryDTO[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCapacity?: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;
}
