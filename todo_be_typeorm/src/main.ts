import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { TransformInterceptor } from './auth/core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  const reflector = app.get(Reflector);
  // All routes using JWT
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  // Transform response
  app.useGlobalInterceptors(new TransformInterceptor(reflector));


  // cookies
  app.use(cookieParser());

  // cors
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port ?? 3000);
}
bootstrap();
