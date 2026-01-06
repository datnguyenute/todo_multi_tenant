import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<StringValue>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<StringValue>('JWT_ACCESS_EXPIRES'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AuthModule {}
