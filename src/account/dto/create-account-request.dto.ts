import { IsEmail, IsNotEmpty } from 'class-validator';
export class createAccountRequest {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
