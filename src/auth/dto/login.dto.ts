import { Allow, IsEmail } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @Allow()
  password: string;
}
