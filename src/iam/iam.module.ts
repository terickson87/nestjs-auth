import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { EnvModule } from '../config/env.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '../config/env.service';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/gaurds/access-token.guard';
import { AuthenticationGuard } from './authentication/gaurds/authentication.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    EnvModule,
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtSecret,
        audience: envService.jwtAudience,
        issuer: envService.jwtIssuer,
        accessTokenTtl: envService.jwtAccessTokenTtl,
      }),
    }),
  ],
  providers: [
    { provide: HashingService, useClass: BcryptService },
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    AccessTokenGuard,
    RefreshTokenIdsStorage,
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
