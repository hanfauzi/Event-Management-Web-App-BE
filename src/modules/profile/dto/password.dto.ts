import { IsNotEmpty, IsString } from "class-validator";

export class PasswordDTO {
  @IsNotEmpty()
  @IsString()
  oldPassword!: string;

  @IsNotEmpty()
  @IsString()
  newPassword!: string;


}
