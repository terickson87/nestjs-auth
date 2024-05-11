import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  Min,
  Max,
  validateSync,
  IsString,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsNotEmpty()
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment;

  // JWT
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
  @IsNotEmpty()
  @IsString()
  JWT_TOKEN_AUDIENCE: string;
  @IsNotEmpty()
  @IsString()
  JWT_TOKEN_ISSUER: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @IsPositive()
  JWT_ACCESS_TOKEN_TTL: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @IsPositive()
  JWT_REFRESH_TOKEN_TTL: number;

  // DB
  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;
  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;
  @IsNotEmpty()
  @IsString()
  DATABASE_PASS: string;
  @IsNotEmpty()
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
