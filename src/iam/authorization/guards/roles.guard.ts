import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../../users/enums/role.enum';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      const user: ActiveUserData = request[REQUEST_USER_KEY];
      console.log(user);
      const userRole = user.role;
      const isAuthorizedByRole = contextRoles.some((role) => userRole === role);
      return isAuthorizedByRole;
    }
  }
}
