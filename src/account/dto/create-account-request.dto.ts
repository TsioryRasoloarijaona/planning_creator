import { IsEmail, IsNotEmpty , IsEnum } from 'class-validator';
export class createAccountRequest {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['ADMIN', 'EMPLOYEE'], {
    message: 'role must be either ADMIN or EMPLOYEE',
  })
  role: 'ADMIN' | 'EMPLOYEE';
}
