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
    AuthenticationService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
