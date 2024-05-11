import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodeEnvironment } from './env.validation';

@Injectable()
export class EnvService {
  constructor(private configService: ConfigService) {}

  get environment(): NodeEnvironment {
    return this.configService.get('NODE_ENV');
  }

  // JWT
  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }
  get jwtAudience(): string {
    return this.configService.get('JWT_TOKEN_AUDIENCE');
  }
  get jwtIssuer(): string {
    return this.configService.get('JWT_TOKEN_ISSUER');
  }
  get jwtAccessTokenTtl(): number {
    return this.configService.get('JWT_ACCESS_TOKEN_TTL');
  }
  get jwtRefreshTokenTtl(): number {
    return this.configService.get('JWT_REFRESH_TOKEN_TTL');
  }

  get jwtOptions() {
    return {
      audience: this.jwtAudience,
      issuer: this.jwtIssuer,
      secret: this.jwtSecret,
    };
  }

  // DB
  get dbHost(): string {
    return this.configService.get('DATABASE_HOST');
  }
  get dbPort(): number {
    return this.configService.get('DATABASE_PORT');
  }
  get dbUser(): string {
    return this.configService.get('DATABASE_USER');
  }
  get dbPass(): string {
    return this.configService.get('DATABASE_PASS');
  }
  get dbName(): string {
    return this.configService.get('DATABASE_NAME');
  }
}
