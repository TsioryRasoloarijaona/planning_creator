import { IsEmail, IsEnum, IsStrongPassword } from 'class-validator';

export class CreateAccountDto {
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 6,
    minNumbers: 2,
  })
  password: string;

  @IsEnum(['ADMIN', 'EMPLOYEE'], {
    message: 'role must be either ADMIN or EMPLOYEE',
  })
  role: 'ADMIN' | 'EMPLOYEE';
}
