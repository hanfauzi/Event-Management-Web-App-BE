import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Min
} from 'class-validator';

export enum Category {
  CULINARY = 'CULINARY',
  MUSIC = 'MUSIC',
  SPORT = 'SPORT',
  COMEDY = 'COMEDY',
  WORKSHOP = 'WORKSHOP',
  ART = 'ART',
  TRAVEL = 'TRAVEL',
  EDUCATION = 'EDUCATION',
  COMMUNITY = 'COMMUNITY',
  FASHION = 'FASHION',
  GAMING = 'GAMING',
  HEALTH = 'HEALTH',
  FAMILY = 'FAMILY',
  RELIGION = 'RELIGION',
  OTHER = 'OTHER',
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  DONE = 'DONE',
}

export class EditEventDTO {
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

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;

  @Type(()=> Number)
  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @IsEnum(EventStatus)
  status!: EventStatus;
}
