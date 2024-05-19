import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ActiveUserData } from '../../interfaces/active-user-data.interface';
import { REQUEST_USER_KEY } from '../../iam.constants';
import { PermissionType } from '../permission.type';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermissions = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermissions) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest();
      const user: ActiveUserData = request[REQUEST_USER_KEY];
      console.log(user);
      const userPermissions = user.permissions;
      const isAuthorizedByPermissions = contextPermissions.every((permission) =>
        userPermissions?.includes(permission),
      );
      return isAuthorizedByPermissions;
    }
  }
}
