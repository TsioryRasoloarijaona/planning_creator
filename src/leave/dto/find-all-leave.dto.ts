export class FindAllLeaveDto {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  accountId: number;
  adminValidator: number | null;
  createdAt: string;
  updatedAt: string | null;
  account: {
    id: number;
    name: string;
    email: string;
  };
  admin: {
    id: number;
    name: string;
    email: string;
  } | null;
}
