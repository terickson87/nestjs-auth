import { Role } from '../../users/enums/role.enum';

export interface ActiveUserData {
  // The token's subject. The User's ID.
  sub: number;
  // The subject's email
  email: string;
  // The subject's role.
  role: Role;
}
