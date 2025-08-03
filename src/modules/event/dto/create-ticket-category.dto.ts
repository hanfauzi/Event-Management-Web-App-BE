import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateTicketCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quota!: number;
}
