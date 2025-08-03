import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
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

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsDateString()
  startDay!: string; // Format: YYYY-MM-DD

  @IsDateString()
  endDay!: string;

  @IsString()
  startTime!: string; // Format: HH:mm

  @IsString()
  endTime!: string;

  @IsEnum(Category)
  category!: Category;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsUrl()
  imageURL!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketCategoryDTO)
  ticketCategories!: CreateTicketCategoryDTO[];

  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @IsEnum(EventStatus)
  status!: EventStatus;
}
