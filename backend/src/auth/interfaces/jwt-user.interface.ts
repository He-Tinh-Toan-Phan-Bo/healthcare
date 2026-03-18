import { UserRole } from '@prisma/client';

export interface JwtUser {
  id: string;
  role: UserRole;
  email: string;
}

