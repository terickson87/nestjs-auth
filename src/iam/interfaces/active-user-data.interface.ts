import { Role } from '../../users/enums/role.enum';
import { PermissionType } from '../authorization/permission.type';

export interface ActiveUserData {
  // The token's subject. The User's ID.
  sub: number;
  // The subject's email
  email: string;
  // The subject's role.
  role: Role;

  /**
   * The subject's permissions.
   * NOTE: Using this approach in combination with the "role-based" approach
   * does not make sense. We have those two properties here ("role" and "permissions")
   * just to showcase two alternative approaches.
   */
  permissions: PermissionType[];
}
