import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { EnvService } from './config/env.service';
import { EnvModule } from './config/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate,
    }),
    EnvModule,
    CoffeesModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: async (envService: EnvService) => ({
        type: 'postgres',
        host: envService.dbHost,
        port: envService.dbPort,
        username: envService.dbUser,
        password: envService.dbPass,
        database: envService.dbName,
        autoLoadEntities: true,
        synchronize: true, // disable for prod, auto creates tables and SQL data types
      }),
    }),
    IamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
