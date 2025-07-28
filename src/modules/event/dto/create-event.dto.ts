import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

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

export class CreateEventDTO {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @Type(() => Date)
  startTime!: Date;

  @Type(() => Date)
  endTime!: Date;

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

  @IsInt()
  @Min(0)
  price!: number;

  @IsInt()
  @Min(1)
  maxCapacity!: number;

  @IsEnum(EventStatus)
  status!: EventStatus;
}
