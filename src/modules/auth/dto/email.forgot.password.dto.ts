import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class EmailDTO {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email!: string;


}
