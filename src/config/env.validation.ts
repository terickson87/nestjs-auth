import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  Min,
  Max,
  validateSync,
  IsString,
  IsPositive,
} from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  // JWT
  @IsString()
  JWT_SECRET: string;
  @IsString()
  JWT_TOKEN_AUDIENCE: string;
  @IsString()
  JWT_TOKEN_ISSUER: string;
  @IsNumber()
  @Min(0)
  @IsPositive()
  JWT_ACCESS_TOKEN_TTL: number;

  // DB
  @IsString()
  DATABASE_HOST: string;
  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;
  @IsString()
  DATABASE_USER: string;
  @IsString()
  DATABASE_PASS: string;
  @IsString()
  DATABASE_NAME: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
