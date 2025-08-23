export class LoginResponseDto {
  accessToken: string;
  account: {
    id: number;
    name: string;
    email: string;
    role: 'ADMIN' | 'EMPLOYEE';
  };
}
