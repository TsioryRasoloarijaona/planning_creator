export class createAccountResDto {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}
