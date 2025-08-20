import { IsEmail, IsStrongPassword } from 'class-validator';
export class CreateAccountDto {
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minNumbers: 2,
  })
  password: string;
}
