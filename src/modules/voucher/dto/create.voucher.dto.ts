import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateVoucherDto {
  @IsString()
  @MinLength(4)
  code!: string;

  @IsInt()
  @IsPositive()
  quota!: number;

  @IsInt()
  @IsPositive()
  discountAmount!: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsString()
  @IsNotEmpty()
  eventId!: string;
}
