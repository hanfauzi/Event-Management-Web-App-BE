import { IsUUID, IsInt, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateTransactionDTO {
  @IsUUID()
  userId!: string;

  @IsUUID()
  eventId!: string;

  @IsUUID()
  ticketCategoryId!: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  usedPoints?: number;

  @IsOptional()
  voucherCode?: string;
}
