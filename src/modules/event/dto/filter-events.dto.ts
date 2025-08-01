import { IsEnum, IsOptional, IsString } from "class-validator";
import { Category } from "../../../generated/prisma";

export class FilterEventsDTO {
  @IsOptional()
  @IsEnum(Category)
  category?: Category;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  take?: number;
}
