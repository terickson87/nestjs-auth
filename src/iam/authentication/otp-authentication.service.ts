import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EnvService } from '../../config/env.service';
import { authenticator } from 'otplib';

@Injectable()
export class OtpAuthenticationService {
  constructor(
    private readonly envService: EnvService,
    @InjectRepository(User) private readonly userRespository: Repository<User>,
  ) {}

  async generateSecret(email: string) {
    const secret = authenticator.generateSecret();
    const appName = this.envService.tfaAppName;
    const uri = authenticator.keyuri(email, appName, secret);
    return { uri, secret };
  }

  verifyCode(code: string, secret: string) {
    return authenticator.verify({
      token: code,
      secret,
    });
  }

  async enableTfaForUser(email: string, secret: string) {
    const { id } = await this.userRespository.findOneOrFail({
      where: { email },
      select: { id: true },
    });

    await this.userRespository.update(
      { id },
      // TIP: Ideally, we would want to encrypt the "secret" instead of
      // storing it in a plaintext. Note - we couldn't use hashing here as
      // the original secret is required to verify the user's provided code.
      { tfaSecret: secret, isTfaEnabled: true },
    );
  }

  async disableTfaForUser(email: string) {
    const { id } = await this.userRespository.findOneOrFail({
      where: { email },
      select: { id: true },
    });

    await this.userRespository.update(
      { id },
      { tfaSecret: null, isTfaEnabled: false },
    );
  }
}
