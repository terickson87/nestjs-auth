import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EnvService } from '../../../config/env.service';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../../iam.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromheader(request);
    if (!token) throw new UnauthorizedException();
    const jwtOptions = this.envService.jwtOptions;

    try {
      const payload = await this.jwtService.verifyAsync(token, jwtOptions);
      request[REQUEST_USER_KEY] = payload;
      console.log(payload);
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromheader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
